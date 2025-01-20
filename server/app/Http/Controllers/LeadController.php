<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use App\Models\LostRemark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf; // Install via `composer require barryvdh/laravel-dompdf`
use Chartjs\Chartjs;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use GuzzleHttp\Client;




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
             // Eager load user, status, chaseNotes, and lostRemarks.declaredUser relationships
             // Filter leads where archive_status is 0
             $leads = Lead::with(['user', 'status', 'chaseNotes', 'lostRemarks.declaredUser'])
                          ->where('archive_status', 0)
                          ->get();
             
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
     public function getArchivedLeads()
     {
         // Fetch leads where archive_status = 1
         $archivedLeads = Lead::with(['user', 'status', 'chaseNotes', 'lostRemarks.declaredUser'])
         ->where('archive_status', 1)->get();
 
         // Return the data as a JSON response
         return response()->json($archivedLeads);
     }
     
     public function getLeadsByConsultant($consultantId)
     {
         try {
             // Fetch leads where user_id matches the consultantId and archive_status is 0
             $leads = Lead::with(['user', 'status', 'chaseNotes', 'lostRemarks.declaredUser'])
                          ->where('user_id', $consultantId)
                          ->where('archive_status', 0)
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
             // Fetch lost leads where user_id matches the consultantId, status_id is 4, and archive_status is 0
             $lostLeads = Lead::with(['user', 'status', 'lostRemarks.declaredUser'])
                              ->where('user_id', $consultantId)
                              ->where('status', 4) // Assuming 4 represents lost status
                              ->where('archive_status', 0)
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
     
public function updateQuoteStatus(Request $request, $id)
{
    try {
        // Validate the request to ensure 'url' is present and valid
        $request->validate([
            'quote_url' => 'required|url',
        ]);

        // Find the lead by its ID
        $lead = Lead::findOrFail($id);

        // Update quote_status and quote_link
        $lead->quote_status = 1;
        $lead->quote_link = $request->quote_url;
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Quote status and link updated successfully',
            'data' => $lead
        ]);
    } catch (\Exception $e) {
        Log::error('Error updating quote status: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while updating the quote status.',
        ], 500);
    }
}

     

public function store(Request $request)
{
    try {
        // Log incoming request data
        Log::debug($request->all());

        // Validate the request data
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'nullable|string|max:255',
            'firstName' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phoneNumber' => 'nullable|string|max:20',
            'houseNumber' => 'nullable|string|max:255',
            'streetName' => 'nullable|string|max:255',
            'townCity' => 'nullable|string|max:255',
            'postalCode' => 'nullable|string|max:10',
            'homeownershipStatus' => 'nullable|string|in:Owner,Tenant',
            'systemQuoted' => 'nullable|string|max:255',
            'quotedPrice' => 'nullable|numeric',
            'totalContractValueGross' => 'nullable|numeric',
            'totalContractValueNet' => 'nullable|numeric',
            'meetingTime' => 'nullable|date',
            'bestTimeToCall' => 'nullable|date',
            'customerType' => 'nullable|string|max:255',
            'status' => 'nullable|exists:lead_statuses,id',
            'clientName'=> 'nullable|string',
            'endUser'=> 'nullable|string',
            'serviceDescription'=> 'nullable|string',
            'contractLength' => 'nullable|string',
            'paymentMethod' => 'nullable|string',
            'paymentFrequency' => 'nullable|string',
            'comissionStatus' => 'nullable|string',
            'customContractLength' => 'nullable|string',
            'maintenanceCheck' => 'nullable|boolean', // Allow nullable for checkboxes
            'installationCheck' => 'nullable|boolean', // Allow nullable for checkboxes
            'monitoringCheck' => 'nullable|boolean', // Allow nullable for checkboxes
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
            'homeownership_status' => $validatedData['customerType'] === 'Commercial' ? null : $validatedData['homeownershipStatus'],
            'system_quoted' => $validatedData['systemQuoted'],
            'quoted_price' => $validatedData['quotedPrice'],
            'meeting_time' => $validatedData['meetingTime'],
            'best_time_to_call' => $validatedData['bestTimeToCall'],
            'customer_type' => $validatedData['customerType'],
            'status' => $validatedData['status'],
            'client_name' => $validatedData['clientName'],
            'end_user' => $validatedData['endUser'],
            'service_description' => $validatedData['serviceDescription'],
            'total_contract_value_net' => $validatedData['totalContractValueNet'],
            'total_contract_value_gross' => $validatedData['totalContractValueGross'],
            'contract_length' => $validatedData['contractLength'] === 'custom' ? $validatedData['customContractLength'] : $validatedData['contractLength'],
            'payment_method' => $validatedData['paymentMethod'],
            'payment_frequency' => $validatedData['paymentFrequency'],
            'commission_status' => $validatedData['comissionStatus'],
            'maintenance_check' => $validatedData['maintenanceCheck'] ? 1 : 0, // Convert to 1 or 0
            'installation_check' => $validatedData['installationCheck'] ? 1 : 0, // Convert to 1 or 0
            'monitoring_check' => $validatedData['monitoringCheck'] ? 1 : 0, // Convert to 1 or 0
            'quote_status' => 0, 
            'archive_status' => 0, 
        ];

        // Calculate commission based on commission status
        $commissionRate = 0;
        if ($validatedData['comissionStatus'] === 'external') {
            $commissionRate = 0.017; // 1.7%
        } elseif ($validatedData['comissionStatus'] === 'internal') {
            $commissionRate = 0.026; // 2.6%
        }
        $mappedData['commission'] = $validatedData['quotedPrice'] * $commissionRate;

        Log::debug($mappedData);

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
        //Log::debug($request->all()); // Log all request data for easier debugging
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
                'total_contract_value_net' => $request->input('total_contract_value_net'),
                'total_contract_value_gross' => $request->input('total_contract_value_gross'),
                'best_time_to_call' => $request->input('best_time_to_call'),
                'customer_type' => $request->input('customer_type'),
                'maintenance_check' => $request->input('maintenance_check'),
                'installation_check' => $request->input('installation_check'),
                'monitoring_check' => $request->input('monitoring_check'),
                'contract_length' => $request->input('contract_length') === 'custom' ? $request->input('custom_contract_length') : $request->input('contract_length'),
                'payment_method' => $request->input('payment_method'),
                'payment_frequency' => $request->input('payment_frequency'),
                'commission_status' => $request->input('commission_status'),
            ];
    
            // Validate the data
            $validator = Validator::make($mappedData, [
                'user_id' => 'nullable|exists:users,id',
                'title' => 'nullable|string|max:255',
                'first_name' => 'nullable|string|max:255',
                'surname' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone_number' => 'nullable|string|max:20',
                'house_number' => 'nullable|string|max:255',
                'street_name' => 'nullable|string|max:255',
                'town_city' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:10',
                'homeownership_status' => 'nullable|string|in:Owner,Tenant',
                'system_quoted' => 'nullable|string|max:255',
                'quoted_price' => 'nullable|numeric',
                'meeting_time' => 'nullable|date',
                'total_contract_value_net' => 'nullable|numeric',
                'total_contract_value_gross' => 'nullable|numeric',
                'best_time_to_call' => 'nullable|date',
                'customer_type' => 'nullable|string|max:255',
                'maintenance_check' => 'nullable|boolean', // Allow nullable for checkboxes
                'installation_check' => 'nullable|boolean', // Allow nullable for _checkboxes
                'monitoring_check' => 'nullable|boolean', // Allow nullable for checkboxes
                'contract_length' => 'nullable|numeric',
                'payment_method' => 'nullable|string|max:255',
                'custom_contract_length' => 'nullable|string',
                'payment_frequency' => 'nullable|string',
                'commission_status' => 'nullable|string',

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
public function delete($id)
{
    try {
        // Find the lead by ID
        $lead = Lead::findOrFail($id);

        // Delete the lead
        //$lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully',
        ]);
    } catch (\Exception $e) {
        Log::error('Error deleting lead: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while deleting the lead.',
        ], 500);
    }
}
public function archive($id)
{
    try {
        // Find the lead by ID
        $lead = Lead::findOrFail($id);

        // Set the archive_status to 1 instead of deleting the lead
        $lead->archive_status = 1;
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Lead archived successfully',
        ]);
    } catch (\Exception $e) {
        Log::error('Error archiving lead: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while archiving the lead.',
        ], 500);
    }
}
public function deleteLead($id)
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json(['message' => 'Lead not found'], 404);
        }

        // Delete the lead record
        $lead->delete();

        return response()->json(['message' => 'Lead deleted successfully']);
    }

    // Restore a lead by updating the archive_status to 0
    public function restoreLead($id)
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json(['message' => 'Lead not found'], 404);
        }

        // Update archive_status to 0 to restore the lead
        $lead->archive_status = 0;
        $lead->save();

        return response()->json(['message' => 'Lead restored successfully']);
    }
    public function downloadSummary(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'dateRange.start' => 'required|date',
            'dateRange.end' => 'required|date|after_or_equal:dateRange.start',
        ]);
    
        $userId = $validated['user_id'];
        $startDate = $validated['dateRange']['start'];
        $endDate = $validated['dateRange']['end'];
    
        $user = User::find($userId);
    
        $leads = Lead::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
    
        $statusGroups = [
            'hot' => $leads->filter(fn($lead) => $lead->status == 1),
            'cold' => $leads->filter(fn($lead) => $lead->status == 2),
            'lost' => $leads->filter(fn($lead) => $lead->status == 4),
            'won' => $leads->filter(fn($lead) => $lead->status == 5),
            'quoted' => $leads->filter(fn($lead) => $lead->quote_status == 1),
        ];
    
        $statusStats = [];
        foreach ($statusGroups as $status => $group) {
            $statusStats[$status] = [
                'leads' => $group,
                'total' => $group->count(),
                'quotedPriceSum' => $group->sum('quoted_price'),
                'quotedPriceAvg' => $group->isNotEmpty() ? $group->avg('quoted_price') : 0,
            ];
        }
    
        // Prepare chart data for QuickChart API
        $chartData = [
            'type' => 'pie',
            'data' => [
                'labels' => array_keys($statusStats),
                'datasets' => [[
                    'data' => array_column($statusStats, 'total'),
                    'backgroundColor' => ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0']
                ]]
            ]
        ];
    
        // Send a request to QuickChart API
        $client = new Client();
        $response = $client->post('https://quickchart.io/chart', [
            'json' => [
                'width' => 500,
                'height' => 300,
                'format' => 'png',
                'chart' => $chartData,
            ]
        ]);
    
        $chartBase64 = base64_encode($response->getBody());
    
        $data = [
            'userId' => $userId,
            'userName' => $user->name,
            'statusStats' => $statusStats,
            'totalLeads' => $leads->count(),
            'startDate' => $startDate,
            'endDate' => $endDate,
            'chartBase64' => $chartBase64,
        ];
    
        $pdf = Pdf::loadView('leads.summary', $data);
    
        return $pdf->download("leads-summary-$userId.pdf");
    }
    
    
    
    
    

}
    


