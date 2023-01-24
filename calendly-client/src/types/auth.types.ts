import { Session } from 'next-auth'

export type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface AppSession extends Session {
  authenticated: boolean
  accessToken?: string
}
