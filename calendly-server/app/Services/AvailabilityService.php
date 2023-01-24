<?php

namespace App\Services;

use App\Models\Event;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AvailabilityService
{
    /**
     * Create many availability
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
     * @param Event $event
     * @param array $availabilities
     * @return void
     */
    public static function createMany(
        Event $event,
        array $availabilities
    ) {
        $ranges = [];

        CarbonPeriod::create(Carbon::now(), Carbon::now()->addMonths(2))
            ->forEach(function ($date) use ($availabilities, &$ranges) {
                $carbonDate = Carbon::parse($date);
                $dayFromDate = $carbonDate->dayName;
                if (array_key_exists($dayFromDate, $availabilities)) {
                    $ranges = array_merge(self::makeDayAvailabilities($carbonDate->toDateString(), $dayFromDate, $availabilities[$dayFromDate]), $ranges);
                }
            });

        $event->availabilities()->createMany($ranges);
    }

    /**
     * Make availability ranges for one day
     * @example dayAvailabilities [
            {
                "start": "09:10",
                "end": "10:00"
            },
            {
                "start": "10:00",
                "end": "11:00"
            }
        ] 
     *
     * @param string $date
     * @param string $day
     * @param array $dayAvailabilities
     * @return array
     */
    public static function makeDayAvailabilities(string $date, string $day,  array $dayAvailabilities): array
    {
        $ranges = [];

        foreach ($dayAvailabilities as $dayAvailability) {
            $ranges = array_merge($ranges, self::slotsBetweenStartAndEndDates($date, $day, $dayAvailability['start'], $dayAvailability['end']));
        }

        return $ranges;
    }

    /**
     * Generate slots between start and end time
     *
     * @param string $date
     * @param string $day
     * @param string $startTime
     * @param string $endTime
     * @return array
     */
    public static function slotsBetweenStartAndEndDates(string $date, string $day, string $startTime, string $endTime): array
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        $ranges = [];
        while ($start->clone()->addMinutes(30)->lessThanOrEqualTo($end)) {
            $ranges[] = ['start' => $start->format('H:i'), 'end' => $start->addMinutes(30)->format('H:i'), 'date' => $date, 'day' => $day];
        }

        return $ranges;
    }
}
