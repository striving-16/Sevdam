import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations'
import { authConfig } from '@/lib/auth-config'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const admin = await db.adminUser.findUnique({
          where: { email: parsed.data.email },
        })
        if (!admin) return null

        // Locked accounts fail the same way as a wrong password — NextAuth's
        // Credentials provider collapses any authorize() outcome into a
        // generic "CredentialsSignin" on the client either way, so a thrown
        // custom-message Error wouldn't reach the login form regardless.
        if (admin.lockedUntil && admin.lockedUntil > new Date()) return null

        const valid = await compare(parsed.data.password, admin.passwordHash)

        if (!valid) {
          const failedAttempts = admin.failedAttempts + 1
          const lockedOut = failedAttempts >= MAX_FAILED_ATTEMPTS
          await db.adminUser.update({
            where: { id: admin.id },
            data: {
              failedAttempts: lockedOut ? 0 : failedAttempts,
              lockedUntil: lockedOut ? new Date(Date.now() + LOCKOUT_MS) : null,
            },
          })
          return null
        }

        if (admin.failedAttempts > 0 || admin.lockedUntil) {
          await db.adminUser.update({
            where: { id: admin.id },
            data: { failedAttempts: 0, lockedUntil: null },
          })
        }

        return { id: admin.id, email: admin.email, name: admin.role }
      },
    }),
  ],
})
