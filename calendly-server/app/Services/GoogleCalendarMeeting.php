<?php

namespace App\Services;

use Carbon\Carbon;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Illuminate\Support\Str;

class GoogleCalendarMeeting
{
    /**
     *
     * @param string $accessToken
     * @param string $refreshToken
     * @param string $eventName
     * @param Carbon $startTime
     * @param Carbon $endTime
     * @param string $timezone
     * @param array $attendees
     * @return string $meetingLink
     */
    public static function create(string $accessToken, string $refreshToken, string $eventName, Carbon $startTime, Carbon $endTime, string $timezone, $attendees = [])
    {
        $client = self::createGoogleClient($accessToken);
        $client->refreshToken($refreshToken);

        $calendar = new \Google\Service\Calendar($client);

        $event = new Event([
            'summary' => $eventName,
            'start' => [
                'dateTime' => $startTime->toRfc3339String(),
                'timeZone' => $timezone
            ],
            'end' => [
                'dateTime' => $endTime->toRfc3339String(),
                'timeZone' => $timezone
            ],
            'attendees' => $attendees,
            'reminders' => array(
                'useDefault' => FALSE,
                'overrides' => array(
                  array('method' => 'email', 'minutes' => 24 * 60),
                  array('method' => 'popup', 'minutes' => 10),
                ),
              )
        ]);

        self::createHangoutLink($event);

        return $calendar->events->insert('primary', $event, ['conferenceDataVersion' => 1])->getHangoutLink();
    }

    /**
     * @param string $accessToken
     * @return \Google_Client
     */
    protected static function createGoogleClient(string $accessToken)
    {
        $client = new \Google_Client();
        $client->setAuthConfig(config('google.client'));
        $client->setAccessToken($accessToken);
        return $client;
    }

    /**
     * @param Event $event
     * @return void
     */
    protected static function createHangoutLink(Event $event)
    {
        $conferenceSKey = new ConferenceSolutionKey();
        $conferenceSKey->setType("hangoutsMeet");
        $createConferenceReq = new CreateConferenceRequest();
        $createConferenceReq->setRequestId(Str::random(2));
        $createConferenceReq->setConferenceSolutionKey($conferenceSKey);
        $conferenceData = new ConferenceData();
        $conferenceData->setCreateRequest($createConferenceReq);
        $event->setConferenceData($conferenceData);
    }
}
