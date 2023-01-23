<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Services\EventService;

class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        return $this->json(EventService::createUserEvent(
            $request->user(),
            $request->name,
            $request->timezone,
            $request->availabilities
        ), 201);
    }
}
