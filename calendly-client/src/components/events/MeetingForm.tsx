import React, { FC, useState } from 'react'

export const MeetingForm: FC<{ createMeeting: (name: string, email: string) => void }> = ({ createMeeting }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const setInForm = (key: string, value: string) => setForm({ ...form, [key]: value })

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="md:pt-16 pt-5 dark:bg-gray-800 bg-white rounded-tr rounded-br">
          <div className="block p-6 rounded-lg shadow-lg bg-white max-w-md">
            <form>
              <div className="form-group mb-6">
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="name"
                  placeholder="Your Name"
                  onChange={(e) => setInForm('name', e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <input
                  type="email"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="email"
                  placeholder="Your Email address"
                  onChange={(e) => setInForm('email', e.target.value)}
                />
              </div>

              <button
                type="button"
                className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => createMeeting(form.name, form.email)}
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
