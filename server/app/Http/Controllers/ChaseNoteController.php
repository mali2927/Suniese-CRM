<?php

namespace App\Http\Controllers;

use App\Models\ChaseNote;
use App\Models\Lead; // Import the Lead model
use Illuminate\Http\Request;

class ChaseNoteController extends Controller
{
    // Store a new chase note
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'talk_details' => 'required|string',
            'chased_via' => 'required|string',
            'date_contacted' => 'required|date',
        ]);

        // Create a new chase note
        $chaseNote = ChaseNote::create([
            'lead_id' => $validated['lead_id'],
            'talk_detail' => $validated['talk_details'],
            'chased_via' => $validated['chased_via'],
            'last_contacted' => $validated['date_contacted'],
        ]);

        // Update the lead with the chase_note ID
        Lead::where('id', $validated['lead_id'])->update(['chase_id' => $chaseNote->id]);

        return response()->json([
            'success' => true,
            'data' => $chaseNote,
        ]);
    }

    // Retrieve chase notes for a specific lead
    public function show($leadId)
    {
        // Get chase notes for the specific lead
        $chaseNotes = ChaseNote::where('lead_id', $leadId)->get();

        return response()->json([
            'success' => true,
            'data' => $chaseNotes,
        ]);
    }
}
