import { EventCard } from '@/components/events/EventCard'
import { redirectIfNotAuthenticated } from '@/services/app/auth.service'
import { network } from '@/services/network.service'
import { AppSession } from '@/types/auth.types'
import { Event } from '@/types/models/event.types'
import { GetSessionParams } from 'next-auth/react'
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
        {events.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetSessionParams) {
  return redirectIfNotAuthenticated(context, async (session: AppSession) => {
    const { data } = await network.get('events', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    return {
      props: {
        events: data.data,
        user: session.user,
      },
    }
  })
}

export default Events
