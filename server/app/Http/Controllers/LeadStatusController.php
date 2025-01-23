<?php

namespace App\Http\Controllers;

use App\Models\LeadStatus;
use Illuminate\Http\JsonResponse;

class LeadStatusController extends Controller
{
    /**
     * Fetch all lead statuses except statuses with IDs 1 and 2.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $statuses = LeadStatus::whereNotIn('id', [1, 2])->get();
        return response()->json($statuses);
    }
}
