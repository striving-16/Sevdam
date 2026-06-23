import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations'
import { authConfig } from '@/lib/auth-config'

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

        const valid = await compare(parsed.data.password, admin.passwordHash)
        if (!valid) return null

        return { id: admin.id, email: admin.email, name: admin.role }
      },
    }),
  ],
})
