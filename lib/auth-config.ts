import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages:   { signIn: '/login' },
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn   = !!session?.user
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
} satisfies NextAuthConfig
