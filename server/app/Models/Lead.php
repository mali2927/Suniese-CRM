<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'first_name',
        'surname',
        'email',
        'phone_number',
        'house_number',
        'street_name',
        'town_city',
        'postal_code',
        'homeownership_status',
        'system_quoted',
        'quoted_price',
        'meeting_time',
        'best_time_to_call',
    ];

    // Define relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
