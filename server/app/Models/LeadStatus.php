<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
    ];

    // Define relationship to Lead
    public function leads()
    {
        return $this->hasMany(Lead::class, 'status', 'id');
    }
}
