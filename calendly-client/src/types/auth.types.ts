import { Session } from "next-auth"

export interface AppSession extends Session {
  authenticated: boolean
  accessToken?: string
}
