<?php

namespace App\Http\Controllers;

use App\Models\LeadStatus;
use Illuminate\Http\JsonResponse;

class LeadStatusController extends Controller
{
    /**
     * Fetch all lead statuses.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $statuses = LeadStatus::all();
        return response()->json($statuses);
    }
}
