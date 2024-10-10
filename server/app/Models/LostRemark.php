<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LostRemark extends Model
{
    use HasFactory;

    // Define the table associated with the model if different from the default (pluralized form of the model name)
    protected $table = 'lost_remarks';

    // Fillable fields for mass assignment
    protected $fillable = [
        'title',
        'lead_id',
        'lost_declared_user',
    ];

    /**
     * Get the lead associated with the lost remark.
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    /**
     * Get the user who declared the loss.
     */
    public function declaredUser()
    {
        return $this->belongsTo(User::class, 'lost_declared_user');
    }
}
