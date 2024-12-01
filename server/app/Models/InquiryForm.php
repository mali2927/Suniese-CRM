<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryForm extends Model
{
    use HasFactory;

    // Define the table name if it's not the plural of the model name
    protected $table = 'inquiry_forms';

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'full_name',
        'full_address',
        'email',
        'phone_number',
        'homeowner_status',
        'user_id',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
