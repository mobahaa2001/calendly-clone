import { WeekDayProps } from '@/types/components/events/form/weekday.types'
import React, { FC } from 'react'

export const WeekdayInput: FC<WeekDayProps> = ({
  day,
  enabled,
  startTimeChange,
  endTimeChange,
  availabilities,
  addAvailability,
  deleteAvailability,
  setChecked,
}) => {
  return (
    <>
      <div className="flex items-start py-4">
        <div className="flex">
          <input type="checkbox" checked={enabled} onChange={() => setChecked(day)} />
          <span className="ml-2 uppercase w-14">{day.slice(0, 3)}</span>
        </div>

        {availabilities.length > 0 && enabled ? (
          <div className="availability-wrapper w-96 ml-4 flex flex-col">
            {availabilities.map((availability, index) => (
              <div className="flex items-start mb-4" key={day + index}>
                <input
                  className="time-from p-4 border rounded shadow h-8"
                  type="time"
                  value={availability.start}
                  onChange={(e) => startTimeChange(day, index, e)}
                />
                <span className="mx-2 text-2xl">-</span>
                <input
                  className="time-to p-4 border rounded shadow h-8"
                  type="time"
                  value={availability.end}
                  onChange={(e) => endTimeChange(day, index, e)}
                />

                <div className="flex items-start">
                  <button
                    className="delete hover:bg-gray-200 rounded ml-6 p-2"
                    onClick={() => deleteAvailability(day, index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-96 ml-4">
            <span className="text-gray-400">Unavailable</span>
          </div>
        )}

        <div className="flex ml-2">
          <button className="add hover:bg-gray-200 rounded p-2" onClick={() => addAvailability(day)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      <hr />
    </>
  )
}
