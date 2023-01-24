import { SessionUser } from '@/types/auth.types'
import { Event } from '@/types/models/event.types'

export type EventCardProps = {
  event: Event
  user: SessionUser
}
