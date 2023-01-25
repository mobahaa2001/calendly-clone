import { buildMonthDays } from '@/services/app/calendar.service'
import moment, { Moment } from 'moment'
import React, { FC, useState } from 'react'

type CalendarProps = {
  selectedDays: Array<string>
  onDaySelected: (day: Moment | null) => void
}

const dayIn = (day: Moment, days: Array<Moment>) => !!days.find((oneDay) => oneDay.isSame(day, 'day'))

export const Calendar: FC<CalendarProps> = ({ selectedDays, onDaySelected }) => {
  const momentSelectedDays = selectedDays.map((selectedDay) => moment(selectedDay))
  const [selected, setSelected] = useState<Moment | null>(null)
  const [current, setCurrent] = useState(moment())
  const monthDays = buildMonthDays(current)

  const previousMonth = () => setCurrent(current.clone().subtract(1, 'M'))
  const nextMonth = () => setCurrent(current.clone().add(1, 'M'))
  const handleSelectDay = (day: Moment | null) => {
    setSelected(day)
    onDaySelected(day)
  }

  const dayStyles = (day: Moment) => {
    if (selected && day.isSame(selected, 'day')) {
      return 'rounded-full text-white bg-blue-500 hover:bg-blue-600 font-bold'
    }

    if (dayIn(day, momentSelectedDays)) {
      return 'rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold cursor-pointer'
    }

    return 'text-gray-400'
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full">
          <div className="md:p-16 md:pb-12 p-5 dark:bg-gray-800 bg-white rounded-tl rounded-bl">
            <div className="px-4 flex items-center justify-between">
              <h1 className="text-2xl dark:text-gray-100 text-gray-800">{current.format('MMMM yyyy')}</h1>
              <div className="flex items-center text-gray-800 dark:text-gray-100">
                <span className="previous cursor-pointer w-fit rounded-sm" onClick={previousMonth}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-chevron-left"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="15 6 9 12 15 18" />
                  </svg>
                </span>
                <span className="next cursor-pointer" onClick={nextMonth}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler ml-3 icon-tabler-chevron-right"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-12 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {moment.weekdays().map((day) => (
                      <th key={day}>
                        <div className="w-full flex justify-center">
                          <p className="text-lg w-12 font-light text-center text-gray-800 dark:text-gray-100">
                            {day.slice(0, 3)}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthDays.map((weekDays, index) => (
                    <tr key={index}>
                      {weekDays.map((day, j) => (
                        <td className="pt-6" key={index + '_' + j} onClick={() => handleSelectDay(day)}>
                          <div className="flex w-full justify-center">
                            {day ? (
                              <p className={`flex items-center justify-center w-12 h-12 ${dayStyles(day)}`}>
                                {day.format('D')}
                              </p>
                            ) : null}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
