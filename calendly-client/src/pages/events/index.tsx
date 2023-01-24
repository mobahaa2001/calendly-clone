import { network } from '@/services/network.service'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'

const Events = ({ events, user }: any) => {
  const router = useRouter()
  return (
    <div className="events-wrapper px-80 py-20">
      <div className="events-header">
        <div className="flex justify-between items-center">
          <div className="userinfo uppercase">{user.name}</div>
          <div className="control">
            <button
              className="flex rounded-2xl border border-blue-600 px-8 py-2 text-blue-600"
              onClick={() => router.push('/events/create')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="ml-2">New Event Type</span>
            </button>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="avs flex flex-wrap">
        {events.map((event: any) => (
          <div key={event.id} className="card pr-4 w-1/4">
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{event.name}</div>
                <p className="text-gray-700 text-base">30 mins One-on-One</p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="flex w-fit rounded-full text-sm font-semibold text-blue-400 mr-2 mb-2">
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
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                  Copy Link
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context)
  console.log(session)
  if (!session || !session.authenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { data } = await network.get('events', {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })

  return {
    props: {
      events: data.data,
      user: session.user,
    },
  }
}

export default Events
