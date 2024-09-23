<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    /**
     * Store a new lead.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */


     public function index()
     {
         try {
            $leads = Lead::with(['user', 'status'])->get();
             return response()->json([
                 'success' => true,
                 'data' => $leads
             ]);
         } catch (\Exception $e) {
             Log::error('Error fetching leads: ' . $e->getMessage());
             return response()->json([
                 'success' => false,
                 'message' => 'An error occurred while fetching leads.',
             ], 500);
         }
     }
     

    public function store(Request $request)
    {
        try{
        // Log incoming request data
        Log::debug($request);

        // Validate the request data
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phoneNumber' => 'required|string|max:20',
            'houseNumber' => 'required|string|max:255',
            'streetName' => 'required|string|max:255',
            'townCity' => 'required|string|max:255',
            'postalCode' => 'required|string|max:10',
            'homeownershipStatus' => 'required|string|in:Owner,Tenant',
            'systemQuoted' => 'required|string|max:255',
            'quotedPrice' => 'required|numeric',
            'meetingTime' => 'required|date',
            'bestTimeToCall' => 'nullable|string|max:255',
            'status' => 'required|exists:lead_statuses,id', // Validate status_id
        ]);

        // Map camelCase fields to snake_case fields
        $mappedData = [
            'user_id' => $validatedData['user_id'],
            'title' => $validatedData['title'],
            'first_name' => $validatedData['firstName'],
            'surname' => $validatedData['surname'],
            'email' => $validatedData['email'],
            'phone_number' => $validatedData['phoneNumber'],
            'house_number' => $validatedData['houseNumber'],
            'street_name' => $validatedData['streetName'],
            'town_city' => $validatedData['townCity'],
            'postal_code' => $validatedData['postalCode'],
            'homeownership_status' => $validatedData['homeownershipStatus'],
            'system_quoted' => $validatedData['systemQuoted'],
            'quoted_price' => $validatedData['quotedPrice'],
            'meeting_time' => $validatedData['meetingTime'],
            'best_time_to_call' => $validatedData['bestTimeToCall'],
            'status' => $validatedData['status'], // Add status_id
        ];
        log::debug($mappedData);

        // Create a new lead in the database
        $lead = Lead::create($mappedData);

        // Return a response
        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data' => $lead
        ]);
    } catch (\Exception $e) {
        Log::error('Error creating lead: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while creating the lead.',
        ], 500);
    }
    }

    public function searchLeadByConsultantId(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,id', // Assumes there's a users table
        ]);

        // Retrieve the user_id from the validated data
        $userId = $validatedData['user_id'];

        // Fetch all leads associated with the given user_id
        $leads = Lead::where('user_id', $userId)->get();

        // Check if any leads were found
        if ($leads->isEmpty()) {
            return response()->json([
                'message' => 'No leads found for the provided user_id.',
                'data' => []
            ], 404);
        }

        // Return the leads as a JSON response
        return response()->json([
            'message' => 'Leads retrieved successfully.',
            'data' => $leads
        ], 200);
    }
}
    


