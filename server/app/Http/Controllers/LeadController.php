<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LostRemark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


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
             // Eager load user, status, and lostRemarks relationships
             $leads = Lead::with(['user', 'status','chaseNotes', 'lostRemarks.declaredUser'])->get();
             
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
     public function getLeadsByConsultant($consultantId)
    {
    try {
        // Fetch leads where user_id matches the consultantId
        $leads = Lead::with(['user', 'status', 'chaseNotes', 'lostRemarks.declaredUser'])
                     ->where('user_id', $consultantId)
                     ->get();
        
        return response()->json([
            'success' => true,
            'data' => $leads
        ]);
    } catch (\Exception $e) {
        Log::error('Error fetching leads for consultant: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while fetching leads for the selected consultant.',
        ], 500);
    }
    }

    public function getLostLeadsByConsultant($consultantId)
    {
    try {
        // Fetch lost leads where user_id matches the consultantId and status id is 4
        $lostLeads = Lead::with(['user', 'status', 'lostRemarks.declaredUser'])
                         ->where('user_id', $consultantId)
                         ->where('status_id', 4) // Assuming 4 represents lost status
                         ->get();
        
        return response()->json([
            'success' => true,
            'data' => $lostLeads
        ]);
    } catch (\Exception $e) {
        Log::error('Error fetching lost leads for consultant: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while fetching lost leads for the selected consultant.',
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
            'totalContractValueGross' => 'required|numeric',
            'totalContractValueNet' => 'required|numeric',
            'meetingTime' => 'required|date',
            'bestTimeToCall' => 'nullable|date',
            'customerType' => 'required|string|max:255',
            'status' => 'required|exists:lead_statuses,id', // Validate status_id
            'clientName'=> 'nullable|string',
            'endUser'=> 'nullable|string',
            'serviceDescription'=> 'nullable|string',
            'contractLength' => 'required|string',
            'paymentMethod' => 'required|string',
            'paymentFrequency' => 'required|string',
            'comissionStatus' => 'required|string',
            'customContractLength' => 'nullable|string',
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
            'homeownership_status' => $validatedData['customerType'] === 'Commercial' ? "null" : $validatedData['homeownershipStatus'],
            'system_quoted' => $validatedData['systemQuoted'],
            'quoted_price' => $validatedData['quotedPrice'],
            'meeting_time' => $validatedData['meetingTime'],
            'best_time_to_call' => $validatedData['bestTimeToCall'],
            'customer_type' => $validatedData['customerType'],
            'status' => $validatedData['status'], // Add status_id
            'client_name' => $validatedData['clientName'], // Add status_id
            'end_user' => $validatedData['endUser'], // Add status_id
            'service_description' => $validatedData['serviceDescription'], // Add status_id
            'total_contract_value_net' => $validatedData['totalContractValueNet'], // Add status_id
            'total_contract_value_gross' => $validatedData['totalContractValueGross'], // Add status_id
            'contract_length' => $validatedData['contractLength'] === 'custom' ? $validatedData['customContractLength'] : $validatedData['contractLength'],
            'payment_method' => $validatedData['paymentMethod'], // Add status_id
            'payment_frequency' => $validatedData['paymentFrequency'], // Add status_id
            'commission_status' => $validatedData['comissionStatus'], // Add status_id
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

    public function update(Request $request, $id)
    {
        Log::debug($request->all()); // Log all request data for easier debugging
        try {
            // Map incoming data to snake_case, matching your DB column names
            $mappedData = [
                'user_id' => $request->input('user_id'),
                'title' => $request->input('title'),
                'first_name' => $request->input('first_name'),
                'surname' => $request->input('surname'),
                'email' => $request->input('email'),
                'phone_number' => $request->input('phone_number'),
                'house_number' => $request->input('house_number'),
                'street_name' => $request->input('street_name'),
                'town_city' => $request->input('town_city'),
                'postal_code' => $request->input('postal_code'),
                'homeownership_status' => $request->input('homeownership_status'),
                'system_quoted' => $request->input('system_quoted'),
                'quoted_price' => $request->input('quoted_price'),
                'meeting_time' => $request->input('meeting_time'),
                'customerType' => 'required|string|max:255',
                'best_time_to_call' => $request->input('best_time_to_call'),
                
            ];
    
            // Validate the data
            $validator = Validator::make($mappedData, [
                'user_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'first_name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone_number' => 'required|string|max:20',
                'house_number' => 'required|string|max:255',
                'street_name' => 'required|string|max:255',
                'town_city' => 'required|string|max:255',
                'postal_code' => 'required|string|max:10',
                'homeownership_status' => 'required|string|in:Owner,Tenant',
                'system_quoted' => 'required|string|max:255',
                'quoted_price' => 'required|numeric',
                'meeting_time' => 'required|date',
                'customer_type' => $validatedData['customerType'],
                'best_time_to_call' => 'nullable|date',
            ]);
    
            // Validate the mapped data
            $validatedData = $validator->validate();
    
            // Find the lead and update it
            $lead = Lead::findOrFail($id);
            $lead->update($validatedData);
    
            // If 'status' is included in the request, update the lead status separately
            if ($request->has('status')) {
                $lead->status()->associate($request->input('status.id'));
                $lead->save();
            }
    
            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully',
                'data' => $lead
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating lead: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the lead.',
            ], 500);
        }
    }


    public function updateStatus(Request $request, $id)
    {
        try {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'statusId' => 'required|exists:lead_statuses,id', // Validate statusId
            ]);
    
            // Find the lead by ID
            $lead = Lead::findOrFail($id);
    
            // Update the lead's status
            $lead->status()->associate($validatedData['statusId']); // Use statusId
            $lead->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Lead status updated successfully',
                'data' => $lead,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating lead status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the lead status.',
            ], 500);
        }
    }
    

    public function updatePayment(Request $request, $id)
{
    try {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'total_payment' => 'required|numeric|min:0', // Validate total_payment
        ]);

        // Find the lead by ID
        $lead = Lead::findOrFail($id);

        // Update the total_payment field
        $lead->total_payment = $validatedData['total_payment'];
        $lead->status = 5; // Set the status to 5
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Total payment updated successfully',
            'data' => $lead,
        ]);
    } catch (\Exception $e) {
        Log::error('Error updating total payment: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while updating the total payment.',
        ], 500);
    }
}

    
public function addLostRemark(Request $request, $leadId)
{
    // Validate the incoming request data
    $request->validate([
        'title' => 'required|string',
        'lead_id' => 'required|exists:leads,id',
        'lost_declared_user' => 'required|exists:users,id',
    ]);

    // Find the lead by ID and update its status to 4
    $lead = Lead::findOrFail($leadId);
    $lead->status = 4; // Set the status to 4
    $lead->save();

    // Create the LostRemark entry
    LostRemark::create([
        'title' => $request->title,
        'lead_id' => $request->lead_id,
        'lost_declared_user' => $request->lost_declared_user,
    ]);

    return response()->json(['success' => true]);
}



}
    


