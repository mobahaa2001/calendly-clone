import { Moment } from 'moment'

export const buildMonthDays = (current: Moment) => {
  const startDayOfMonth = current.clone().startOf('month')
  const endDayOfMonth = current.clone().endOf('month')

  let offset = startDayOfMonth.weekday()
  const currentLoopDay = startDayOfMonth.clone().subtract(1, 'day')
  const monthDays = []
  let index = 0

  while (currentLoopDay.isBefore(endDayOfMonth, 'day')) {
    const remainingDays = endDayOfMonth.diff(currentLoopDay, 'day')
    const weekDays = []

    let j = 0
    // render empty days
    if (index === 0) {
      for (let y = 0; y < offset; y++) {
        weekDays.push(null)
      }
      j = offset
    }

    for (; j < (remainingDays >= 7 ? 7 : remainingDays); j++) {
      weekDays.push(currentLoopDay.add(1, 'day').clone())
    }

    monthDays.push(weekDays)

    index++
  }

  return monthDays
}
