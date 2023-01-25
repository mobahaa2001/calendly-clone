import { DayAvailabilities } from '@/components/events/DayAvailabilities'
import { MeetingForm } from '@/components/events/MeetingForm'
import { Calendar } from '@/components/UI/Calendar'
import { network } from '@/services/network.service'
import { Availability } from '@/types/models/availability'
import { UserCalendarPageProps } from '@/types/pages/user-calendar'
import { Moment } from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import swal from 'sweetalert'

const UserCalendarPage: FC<UserCalendarPageProps> = ({ event }) => {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null)
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null)

  const displayDayMeetings = (date: Moment | null) => {
    setSelectedAvailability(null)
    setSelectedDate(date)
  }

  const onSlotSelected = (availability: Availability) => {
    setSelectedAvailability(availability)
  }

  useEffect(() => {
    const meetingCreated = !!localStorage.getItem('meetingCreated')
    localStorage.removeItem('meetingCreated')
    if (meetingCreated) {
      swal({
        title: 'Good job!',
        text: 'You clicked the button!',
        icon: 'success',
        buttons: 'Aww yiss!',
      } as { [key: string]: any })

      setTimeout(() => {
        if (swal.close) {
          swal.close()
        }
      }, 2000)
    }
  }, [router])

  return (
    <div className="availability-wrapper h-full">
      <div className="div flex w-1/2 m-auto pt-14">
        <div className="flex-1">
          <Calendar selectedDays={Object.keys(event.availabilities)} onDaySelected={displayDayMeetings}></Calendar>
        </div>
        <div className="flex-1">
          {selectedDate && !selectedAvailability ? (
            <DayAvailabilities
              dayDate={selectedDate}
              availabilities={event.availabilities[selectedDate.format('YYYY-MM-DD')]}
              onAvailabilitySelected={onSlotSelected}
            ></DayAvailabilities>
          ) : null}
          {selectedAvailability ? <MeetingForm selectedAvailability={selectedAvailability} /> : null}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId } = context.query
  const { data } = await network.get(`events/${eventId}`)

  return {
    props: {
      event: data.data,
    },
  }
}
export default UserCalendarPage
