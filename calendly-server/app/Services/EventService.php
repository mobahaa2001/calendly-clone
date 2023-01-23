<?php

namespace App\Services;

use App\Models\User;

class EventService
{
    /**
     * Create Event with availabilities for a specific user
     * @example availabilitiesGroupedByDay {
        "Sunday": [
            {
                "start": "09:10",
                "end": "10:00"
            },
            {
                "start": "10:00",
                "end": "11:00"
            }
        ],
        "Saturday": [
            {
                "start": "09:10",
                "end": "10:00"
            }
        ]
    }
     *
     * @param User $user
     * @param string $eventName
     * @param string $timezone
     * @param array $availabilitiesGroupedByDay
     * @return void
     */
    public static function createUserEvent(User $user, string $eventName, string $timezone, array $availabilitiesGroupedByDay)
    {
        $event = $user->events()->create([
            'name' => $eventName,
            'timezone' => $timezone
        ]);

        return AvailabilityService::createMany(
            $event,
            $availabilitiesGroupedByDay
        );
    }
}
