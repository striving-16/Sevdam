import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
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
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute && !isLoggedIn) return false
      return true
    },
    jwt({ token, user }) {
      if (user) token.role = user.name
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.name = token.role as string
      return session
    },
  },
})
