<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChaseNote extends Model
{
    use HasFactory;

    // Specify the table name if it's not the plural form of the model name
    protected $table = 'chase_notes';

    // Specify the fillable fields for mass assignment
    protected $fillable = [
        'lead_id',        // Foreign key for the lead
        'talk_detail',        // Foreign key for the lead
        'chased_via',     // Method used to chase
        'last_contacted', // Last contacted timestamp
    ];

    // Define the relationship to the Lead model
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
