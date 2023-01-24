import React, { FC, useState } from 'react'
import moment from 'moment'
import { GetSessionParams } from 'next-auth/react'
import { useRouter } from 'next/router'
import { WeekdayInput } from '@/components/events/form/WeekDayInput'
import { network } from '@/services/network.service'
import { AppSession } from '@/types/auth.types'
import { redirectIfNotAuthenticated } from '@/services/app/auth.service'

export type Availability = { start: string; end: string }

const initAvailabilities = () =>
  moment
    .weekdays()
    .reduce((acc: { [key: string]: { enabled: boolean; availabilities: Array<Availability> } }, current) => {
      acc[current] = { enabled: false, availabilities: [] }
      return acc
    }, {})

export const CreateEvent: FC<{ session: AppSession }> = ({ session }) => {
  const [eventName, setEventName] = useState('')
  const [availabilities, setAvailabilities] = useState(initAvailabilities)
  const router = useRouter()

  const deleteAvailability = (day: string, index: Number) => {
    setAvailabilities({
      ...availabilities,
      [day]: {
        enabled: availabilities[day].availabilities.length <= 1 ? false : availabilities[day].enabled,
        availabilities: availabilities[day].availabilities.filter((_, i) => i != index),
      },
    })
  }

  const addAvailability = (day: string) => {
    let newAvailability = { start: '09:00', end: '10:00' }
    const inDay = availabilities[day]
    if (inDay.availabilities.length > 0) {
      let prev = inDay.availabilities[inDay.availabilities.length - 1]
      newAvailability.start = prev.end
      newAvailability.end = moment(prev.end, [moment.ISO_8601, 'HH:mm']).add(0.5, 'hour').format('HH:mm')
    }
    setAvailabilities({
      ...availabilities,
      [day]: {
        enabled: true,
        availabilities: [...availabilities[day].availabilities, newAvailability],
      },
    })
  }

  const startTimeChange = (day: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAvailabilities = { ...availabilities }
    newAvailabilities[day].availabilities[index].start = e.target.value
    setAvailabilities(newAvailabilities)
  }

  const endTimeChange = (day: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAvailabilities = { ...availabilities }
    newAvailabilities[day].availabilities[index].end = e.target.value
    setAvailabilities(newAvailabilities)
  }

  const setChecked = (day: string) => {
    const newAvailabilities = { ...availabilities }
    if (!newAvailabilities[day].enabled && newAvailabilities[day].availabilities.length === 0) {
      newAvailabilities[day].availabilities.push({ start: '09:00', end: '10:00' })
    }
    newAvailabilities[day].enabled = !availabilities[day].enabled
    setAvailabilities(newAvailabilities)
  }

  const submitAvailability = async () => {
    const av = Object.fromEntries(
      Object.entries(availabilities)
        .filter(([_, dayAvailability]) => dayAvailability.enabled)
        .map(([day, dayAvailability]) => [day, dayAvailability.availabilities])
    )

    const postedData = {
      availabilities: av,
      name: eventName,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    try {
      await network.post('events', postedData, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      router.push('/events')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="event-form mx-80 m-auto flex justify-center bg-red">
      <div className="card-wrapper">
        <div className="flex justify-center">
          <div className="block w-full p-6 rounded-lg shadow-lg bg-white mt-8">
            <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Create Your Availability</h5>
            <hr className="mb-8" />
            <div className="card-body">
              <div className="form">
                <div className="flex">
                  <div className="mb-3 xl:w-96">
                    <label htmlFor="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700">
                      Event Name
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="exampleFormControlInput1"
                      placeholder="Event Name"
                      onChange={(e) => setEventName(e.target.value)}
                      value={eventName}
                    />
                  </div>
                </div>
                {moment.weekdays().map((weekDay) => (
                  <WeekdayInput
                    key={weekDay}
                    day={weekDay}
                    availabilities={availabilities[weekDay].availabilities}
                    enabled={availabilities[weekDay].enabled}
                    addAvailability={addAvailability}
                    deleteAvailability={deleteAvailability}
                    startTimeChange={startTimeChange}
                    endTimeChange={endTimeChange}
                    setChecked={setChecked}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-4 flex items-center w-24 px-4 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              onClick={submitAvailability}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </span>
              <span className="ml-2">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetSessionParams) {
  return redirectIfNotAuthenticated(context, (session: AppSession) => {
    return {
      props: {
        session,
      },
    }
  })
}

export default CreateEvent
