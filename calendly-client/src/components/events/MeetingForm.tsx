import { network } from '@/services/network.service'
import { Availability } from '@/types/models/availability'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'

const initFormError = { name: [], email: [] }

export const MeetingForm: FC<{
  selectedAvailability: Availability
}> = ({ selectedAvailability }) => {
  const router = useRouter()

  const [formError, setFormError] = useState<{ [key: string]: Array<string> }>(initFormError)
  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const createMeeting = async () => {
    setFormError(initFormError)
    try {
      await network.post('meetings', {
        ...form,
        availability_id: selectedAvailability?.id,
      })
      localStorage.setItem('meetingCreated', 'true')
      router.reload()
    } catch (e: any) {
      if (e.response && e.response.status === 422) {
        setFormError(e.response.data.error)
      }
    }
  }

  const setInForm = (key: string, value: string) => {
    setFormError({ ...formError, [key]: [] })
    setForm({ ...form, [key]: value })
  }

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="md:pt-16 pt-5 dark:bg-gray-800 bg-white rounded-tr rounded-br">
          <div className="block p-6 rounded-lg shadow-lg bg-white max-w-md">
            <div className="form-header mb-4">
              <div className="meetingInfo flex">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                <h5 className="ml-2">
                  <div>{moment(selectedAvailability.date).format('dddd, MMMM DD')}</div>
                  <div className="time flex">
                    <span className="start"></span>
                    {moment(selectedAvailability.start, [moment.ISO_8601, 'HH:mm']).format('hh:mma')}
                    <span className="mx-2">-</span>
                    <span className="end">
                      {moment(selectedAvailability.end, [moment.ISO_8601, 'HH:mm']).format('hh:mma')}
                    </span>
                  </div>
                </h5>
              </div>
            </div>
            <form>
              <div className="form-group mb-6">
                <input
                  type="text"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${
                    formError['name'] && formError['name'].length >= 1 ? 'border-red-700' : ''
                  }`}
                  id="name"
                  placeholder="Your Name"
                  onChange={(e) => setInForm('name', e.target.value)}
                />
                {formError['name'] && formError['name'].length >= 1 ? (
                  <div className="input-error text-red-700">{formError['name'].join()}</div>
                ) : null}
              </div>
              <div className="form-group mb-6">
                <input
                  type="email"
                  className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${
                    formError['email'] && formError['email'].length >= 1 ? 'border-red-700' : ''
                  }`}
                  id="email"
                  placeholder="Your Email address"
                  onChange={(e) => setInForm('email', e.target.value)}
                />
              </div>
              {formError['email'] && formError['email'].length >= 1 ? (
                <div className="input-error text-red-700">{formError['email'].join()}</div>
              ) : null}

              <button
                type="button"
                className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => createMeeting()}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
