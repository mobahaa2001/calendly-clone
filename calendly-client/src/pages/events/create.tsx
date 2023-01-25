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
  const [error, setError] = useState<any>(null)
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
    setError(null)
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
    } catch (e: any) {
      if (e.response && e.response.status === 422) {
        setError({ message: e.response.data.message, errors: e.response.data.error })
      }
    }
  }

  return (
    <div className="relative event-form mx-80 m-auto flex justify-center bg-red">
      {error ? (
        <div className="absolute left-0 top-8">
          <div className="max-w-sm bg-red-500 text-sm text-white rounded-md shadow-lg" role="alert">
            <div className="flex p-4">
              {error.message}
              <div className="ml-auto">
                <button
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-white/[.5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-800 focus:ring-red-500 transition-all text-sm dark:focus:ring-offset-red-500 dark:focus:ring-red-700"
                  onClick={() => setError(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <ul>
                {Object.keys(error.errors).map((key) => (
                  <li key={key}>* {error.errors[key].join('')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

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
