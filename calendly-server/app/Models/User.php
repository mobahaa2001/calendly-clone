<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function specificAccount()
    {
        return $this->belongsTo(Account::class);
    }

    public function scopeWithSpecificAccount(Builder $query, string $accountProvider = 'google')
    {
        $query->addSelect(['specific_account_id' => Account::select('id')
            ->whereColumn('user_id', 'users.id')
            ->where('provider', $accountProvider)
            ->latest()
            ->take(1),
        ])->with('specificAccount');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
