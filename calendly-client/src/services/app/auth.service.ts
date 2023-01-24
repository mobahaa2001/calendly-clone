import { AppSession } from '@/types/auth.types'
import { getSession, GetSessionParams } from 'next-auth/react'

export const redirectIfNotAuthenticated = async (context: GetSessionParams, cb: Function) => {
  const session = await getSession(context)

  if (!session || !(session as AppSession).authenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return cb(session as AppSession)
}
