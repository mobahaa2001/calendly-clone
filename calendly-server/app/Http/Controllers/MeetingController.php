<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMeetingRequest;
use App\Services\MeetingService;

class MeetingController extends Controller
{
    public function store(StoreMeetingRequest $request)
    {
        return $this->json(MeetingService::create(
            $request->availability_id,
            $request->email,
            $request->name,
            'google'
        ), 201);
    }
}
