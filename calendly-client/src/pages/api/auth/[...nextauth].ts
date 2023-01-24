import { network } from '@/services/network.service'
import moment from 'moment'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: process.env.GOOGLE_CLIENT_SCOPE,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        try {
          const { data } = await network.post('auth/oauth-login', {
            email: token.email,
            name: token.name,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: moment(account.expires_at).toISOString(),
            provider: account.provider
          })
          token.accessToken = data.data.token
        } catch (e: any) {
          token.error = e.response.data
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.error) {
        session.user = undefined
        return {
          authenticated: false,
          error: token.error,
          ...session,
        }
      }

      return {
        authenticated: true,
        accessToken: token.accessToken,
        ...session,
      }
    },
    async redirect({ baseUrl, url }) {
      return '/events'
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
