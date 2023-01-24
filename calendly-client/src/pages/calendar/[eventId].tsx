import { DayAvailabilities } from '@/components/events/DayAvailabilities'
import { MeetingForm } from '@/components/events/MeetingForm'
import { Calendar } from '@/components/UI/Calendar'
import { network } from '@/services/network.service'
import { UserCalendarPageProps } from '@/types/pages/user-calendar'
import { Moment } from 'moment'
import { GetServerSideProps } from 'next'
import React, { FC, useState } from 'react'

const UserCalendarPage: FC<UserCalendarPageProps> = ({ event }) => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null)
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null)

  const displayDayMeetings = (date: Moment | null) => {
    setSelectedDate(date)
  }

  const onSlotSelected = (availabilityId: string) => {
    setSelectedAvailability(availabilityId)
  }

  const createMeeting = async (name: string, email: string) => {
    try {
      await network.post('meetings', {
        name,
        email,
        availability_id: selectedAvailability,
      })
    } catch (e) {
      console.error(e)
    }
  }

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
          {selectedAvailability ? <MeetingForm createMeeting={createMeeting} /> : null}
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
