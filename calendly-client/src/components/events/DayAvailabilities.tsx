import { Availability } from '@/types/models/availability';
import moment, { Moment } from 'moment'
import React from 'react'

export const DayAvailabilities = ({ availabilities, dayDate }: { availabilities: Array<Availability>; dayDate: Moment }) => {
  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="md:pt-16 pt-5 dark:bg-gray-800 bg-white rounded-tr rounded-br">
          <h1 className="text-2xl dark:text-gray-100 text-gray-800">
            {dayDate.format('dddd, MMMM DD')}
          </h1>
          <div className="mt-8 px-4 overflow-auto" style={{ height: '459px' }}>
            <ul className="flex flex-col">
              {availabilities.map((availability) => (
                <li key={availability.id} className="w-full">
                  <button className="w-full border border-blue-400 px-14 py-4 mt-4 rounded text-blue-600 font-bold text-xl hover:border-blue-700 hover:border-2">
                    {moment(availability.start, [moment.ISO_8601, 'HH:mm']).format('hh:mma')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
