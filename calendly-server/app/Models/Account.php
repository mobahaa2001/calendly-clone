<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = ['access_token', 'refresh_token', 'provider', 'expires_at'];

    public static function allowedProviders()
    {
        return ['google'];
    }
}
