export type WeekDayProps = {
  day: string
  enabled: boolean
  availabilities: Array<{ start: string; end: string }>
  startTimeChange: (day: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  endTimeChange: (day: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  addAvailability: (day: string) => void
  deleteAvailability: (day: string, index: number) => void
  setChecked: (day: string) => void
}
