import { Availability } from '@/types/models/availability'
import { Moment } from 'moment'

export type DayAvailabilitiesProps = {
  availabilities: Array<Availability>
  dayDate: Moment
  onAvailabilitySelected: (availability: Availability) => void
}
