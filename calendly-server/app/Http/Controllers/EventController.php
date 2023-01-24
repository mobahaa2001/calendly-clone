<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;

class EventController extends Controller
{
    public function index()
    {
        return $this->json(request()->user()->events);
    }

    public function show(Event $event)
    {
        return $this->json(new EventResource($event->load(['availabilities', 'user'])));
    }

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
