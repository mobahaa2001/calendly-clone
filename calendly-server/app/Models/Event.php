<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'timezone'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }
}
