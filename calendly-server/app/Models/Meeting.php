<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = ['host_id', 'requestor_email', 'requestor_name', 'link', 'provider', 'availability_id'];
}
