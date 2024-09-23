<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


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
        'status',  // Add status here
        'total_payment',
    ];

    // Define relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define relationship to LeadStatus
    public function status()
    {
        return $this->belongsTo(LeadStatus::class, 'status', 'id');
    }
}
