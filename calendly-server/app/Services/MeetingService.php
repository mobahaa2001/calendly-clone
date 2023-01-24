<?php

namespace App\Services;

use App\Models\Availability;
use Carbon\Carbon;

class MeetingService
{
    /**
     * @param string $availabilityId
     * @param string $requestorEmail
     * @param string $requestorName
     * @param string $provider
     * @return void
     */
    public static function create(string $availabilityId, string $requestorEmail, string $requestorName, string $provider)
    {
        $availability = Availability::with(['event.user' => function ($q) {
            $q->withSpecificAccount();
        }])->where('id', $availabilityId)->first();

        $link = GoogleCalendarMeeting::create(
            $availability->event->user->specificAccount->access_token,
            $availability->event->user->specificAccount->refresh_token,
            "$requestorName and {$availability->event->user->name}",
            Carbon::parse("$availability->date {$availability->start}"),
            Carbon::parse("$availability->date {$availability->end}"),
            $availability->event->timezone,
            [
                ['email' => $requestorEmail]
            ]
        );

        $availability->meetings()->create([
            'host_id' => $availability->event->user->id,
            'requestor_email' => $requestorEmail,
            'requestor_name' => $requestorName,
            'provider' => $provider,
            'link' => $link
        ]);
    }
}
