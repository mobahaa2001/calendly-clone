import { Availability } from '@/types/models/availability'

export type Event = {
  id: string
  name: string
}

export interface FullEvent extends Event {
  availabilities: {
    [key: string]: Array<Availability>
  }
}
