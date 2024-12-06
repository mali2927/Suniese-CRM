<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'status', // Status column
        'total_payment',
        'customer_type',
        'chase_id',
        'client_name',             // New field
        'end_user',                // New field
        'service_description',     // New field
        'commission',              // New field
        'commission_status',       // New field
        'total_contract_value_net',  // New field for net contract value
        'total_contract_value_gross', // New field for gross contract value
        'contract_length',          // New field for contract length
        'payment_method',           // New field for payment method
        'payment_frequency',        // New field for payment frequency
        'maintenance_check',       // New field for maintenance check
        'quote_status',
        'archive_status',
        'monitoring_check',
        'installation_check'
    ];

    // Define relationship to User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Define relationship to LeadStatus
    public function status(): BelongsTo
    {
        return $this->belongsTo(LeadStatus::class, 'status', 'id');
    }

    // Define relationship to LostRemark
    public function lostRemarks(): HasMany
    {
        return $this->hasMany(LostRemark::class);
    }

    // Define relationship to ChaseNote
    public function chaseNotes(): HasMany
    {
        return $this->hasMany(ChaseNote::class);
    }
}
