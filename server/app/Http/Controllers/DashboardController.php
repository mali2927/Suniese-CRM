<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;


class DashboardController extends Controller
{
    public function getDashboardReport(Request $request): JsonResponse
    {
        // Get the start and end dates from the query parameters, if available
        $startDate = $request->query('start_date', '1970-01-01'); // Default to the beginning of time
        $endDate = $request->query('end_date', Carbon::now()->toISOString()); // Default to current date
    
        // Convert the date strings to Carbon instances
        $startDate = Carbon::parse($startDate)->startOfDay(); // Start of the day
        $endDate = Carbon::parse($endDate)->endOfDay(); // End of the day
    
        // Log the start and end dates for debugging
        \Log::info("Start Date: {$startDate}, End Date: {$endDate}");
    
        // Total number of sales consultants
        $totalConsultants = User::where('role', 'Sales Consultant')->count();
    
        // Total number of leads within the date range
        $totalLeads = Lead::where(function($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                  ->orWhereBetween('updated_at', [$startDate, $endDate]);
        })->count();
    
        // Total revenue (sum of total_payment in the leads with status = 5 within the date range)
        $totalRevenue = Lead::where('status', 5)
                            ->where(function($query) use ($startDate, $endDate) {
                                $query->whereBetween('created_at', [$startDate, $endDate])
                                      ->orWhereBetween('updated_at', [$startDate, $endDate]);
                            })
                            ->sum('total_payment');
    
        // Total number of won leads (status = 5)
        $wonLeads = Lead::where('status', 5)
                        ->where(function($query) use ($startDate, $endDate) {
                            $query->whereBetween('created_at', [$startDate, $endDate])
                                  ->orWhereBetween('updated_at', [$startDate, $endDate]);
                        })
                        ->count();
    
        // Prepare the response data
        $data = [
            'total_consultants' => $totalConsultants,
            'total_leads' => $totalLeads,
            'total_revenue' => $totalRevenue,
            'won_leads' => $wonLeads,
        ];
    
        return response()->json($data);
    }

    
    public function getLeadStatusCounts(Request $request): JsonResponse
    {
        // Validate the date range inputs
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
    
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
    
        // Get count and sum of quoted price grouped by status within the date range
        $leadStatusData = Lead::selectRaw('status, COUNT(*) as count, SUM(quoted_price) as total_price')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [
                    $item->status => [
                        'count' => $item->count,
                        'total_price' => $item->total_price,
                        'average_price' => $item->count > 0 ? $item->total_price / $item->count : 0, // Calculate average
                    ],
                ];
            });
    
        // Get count and sum of quoted leads where quote_status = 1 within the date range
        $quotedLeadsData = Lead::selectRaw('COUNT(*) as count, SUM(quoted_price) as total_price')
            ->where('quote_status', 1)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->first();
        $unQuotedLeadsData = Lead::selectRaw('COUNT(*) as count, SUM(quoted_price) as total_price')
            ->where('quote_status', 0)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->first();
    
        // Get total payment sum for status 5 (Won) within the date range
        $totalPaymentWon = Lead::where('status', 5)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_payment');
    
        // Create a response with status IDs mapped to their names
        $data = [
            'hot' => [
                'count' => $leadStatusData[1]['count'] ?? 0,
                'total_price' => $leadStatusData[1]['total_price'] ?? 0,
                'average_price' => $leadStatusData[1]['average_price'] ?? 0, // Average for Hot
            ],
            'cold' => [
                'count' => $leadStatusData[2]['count'] ?? 0,
                'total_price' => $leadStatusData[2]['total_price'] ?? 0,
                'average_price' => $leadStatusData[2]['average_price'] ?? 0, // Average for Cold
            ],
            'warm' => [
                'count' => $leadStatusData[3]['count'] ?? 0,
                'total_price' => $leadStatusData[3]['total_price'] ?? 0,
                'average_price' => $leadStatusData[3]['average_price'] ?? 0, // Average for Warm
            ],
            'lost' => [
                'count' => $leadStatusData[4]['count'] ?? 0,
                'total_price' => $leadStatusData[4]['total_price'] ?? 0,
                'average_price' => $leadStatusData[4]['average_price'] ?? 0, // Average for Lost
            ],
            'won' => [
                'count' => $leadStatusData[5]['count'] ?? 0,
                'total_price' => $leadStatusData[5]['total_price'] ?? 0,
                'average_price' => $leadStatusData[5]['average_price'] ?? 0, // Average for Won
                'total_payment' => $totalPaymentWon, // Total payment for Won
            ],
            'quoted' => [
                'count' => $quotedLeadsData->count ?? 0,
                'total_price' => $quotedLeadsData->total_price ?? 0,
                'average_price' => $quotedLeadsData->count > 0
                    ? $quotedLeadsData->total_price / $quotedLeadsData->count
                    : 0, // Average for Quoted
            ],
            'unquoted' => [
                'count' => $unQuotedLeadsData->count ?? 0,
                'total_price' => $unQuotedLeadsData->total_price ?? 0,
                'average_price' => $unQuotedLeadsData->count > 0
                    ? $unQuotedLeadsData->total_price / $unQuotedLeadsData->count
                    : 0, // Average for Quoted
            ],
        ];
    
        return response()->json($data);
    }
    

    public function getLeadStatusCountsByUserId($userId): JsonResponse
    {
        // Get count and sum of quoted price grouped by status for the given user ID
        $leadStatusData = Lead::selectRaw('status, COUNT(*) as count, SUM(quoted_price) as total_price')
            ->where('user_id', $userId) // Filter by user ID
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => ['count' => $item->count, 'total_price' => $item->total_price]];
            });
    
        // Get total payment sum for status 5 (Won) for the given user ID
        $totalPaymentWon = Lead::where('user_id', $userId) // Filter by user ID
            ->where('status', 5)
            ->sum('total_payment');
    
        // Get count and sum of quoted leads where quote_status = 1 for the given user ID
        $quotedLeadsData = Lead::selectRaw('COUNT(*) as count, SUM(quoted_price) as total_price')
            ->where('user_id', $userId) // Filter by user ID
            ->where('quote_status', 1)
            ->first();
    
        // Create a response with status IDs mapped to their names
        $data = [
            'hot' => ['count' => $leadStatusData[1]['count'] ?? 0, 'total_price' => $leadStatusData[1]['total_price'] ?? 0],   // Status ID 1 = Hot
            'cold' => ['count' => $leadStatusData[2]['count'] ?? 0, 'total_price' => $leadStatusData[2]['total_price'] ?? 0],  // Status ID 2 = Cold
            'warm' => ['count' => $leadStatusData[3]['count'] ?? 0, 'total_price' => $leadStatusData[3]['total_price'] ?? 0],  // Status ID 3 = Warm
            'lost' => ['count' => $leadStatusData[4]['count'] ?? 0, 'total_price' => $leadStatusData[4]['total_price'] ?? 0],  // Status ID 4 = Lost
            'won' => [
                'count' => $leadStatusData[5]['count'] ?? 0,
                'total_price' => $leadStatusData[5]['total_price'] ?? 0,
                'total_payment' => $totalPaymentWon,  // Add total payment for Won leads
            ],
            'quoted' => [
                'count' => $quotedLeadsData->count ?? 0, 
                'total_price' => $quotedLeadsData->total_price ?? 0
            ], // Add quoted leads count and sum
        ];
    
        return response()->json($data);
    }
    
    


   
    public function getWeeklyLeadData(): JsonResponse
    {
        // Get the total leads per week for the last 4 weeks
        $weeklyTotalLeads = Lead::selectRaw('WEEK(created_at) as week, COUNT(*) as total')
            ->whereBetween('created_at', [Carbon::now()->subWeeks(4), Carbon::now()])
            ->groupBy('week')
            ->orderBy('week', 'asc')
            ->get()
            ->pluck('total', 'week');

        // Get the "won" (converted) leads per week for the last 4 weeks
        $weeklyConvertedLeads = Lead::selectRaw('WEEK(created_at) as week, COUNT(*) as total')
            ->where('status', 5) // 5 is the ID for "Won"
            ->whereBetween('created_at', [Carbon::now()->subWeeks(4), Carbon::now()])
            ->groupBy('week')
            ->orderBy('week', 'asc')
            ->get()
            ->pluck('total', 'week');

        // Response format: total and converted sales by week
        $data = [
            'weeks' => array_keys($weeklyTotalLeads->toArray()), // Weeks numbers
            'total_leads' => array_values($weeklyTotalLeads->toArray()), // Total leads count
            'converted_sales' => array_values($weeklyConvertedLeads->toArray()) // "Won" leads count
        ];

        return response()->json($data);
    }
}
