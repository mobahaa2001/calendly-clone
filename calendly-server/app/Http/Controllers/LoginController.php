<?php

namespace App\Http\Controllers;

use App\Http\Requests\OauthLoginRequest;
use App\Services\OauthService;

class LoginController extends Controller
{
    public function withOauth(OauthLoginRequest $request)
    {
        return $this->json(
            [
                'token' => OauthService::login(
                    $request->email,
                    $request->name,
                    $request->provider,
                    $request->access_token,
                    $request->refresh_token,
                    $request->expires_at
                )
            ],
            201
        );
    }
}
