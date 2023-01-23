<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class OauthService
{
    /**
     * Login the user via Oauth
     *
     * @param string $email
     * @param string $name
     * @param string $provider
     * @param string $accessToken
     * @param string $refreshToken
     * @param string $expiresAt
     * @return string $authToken
     */
    public static function login(
        string $email,
        string $name,
        string $provider,
        string $accessToken,
        string $refreshToken,
        string $expiresAt
    ): string {
        $user = User::firstOrCreate(
            ['email' => $email],
            ['name' => $name]
        )->first();

        $user->accounts()->updateOrCreate(
            ['provider' => $provider],
            [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'expires_at' => Carbon::parse($expiresAt)
            ]
        );

        return $user->createToken('auth_token')->plainTextToken;
    }
}
