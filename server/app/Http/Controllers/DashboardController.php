<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardReport(): JsonResponse
    {
        // Total number of sales consultants (assuming they have a specific role, e.g., 'sales consultant')
        $totalConsultants = User::where('role', 'Sales Consultant')->count();

        // Total number of leads
        $totalLeads = Lead::count();

        // Total revenue (sum of total_payment in the leads)
        $totalRevenue = Lead::where('status', 5)->sum('total_payment');


        // Prepare the response data
        $data = [
            'total_consultants' => $totalConsultants,
            'total_leads' => $totalLeads,
            'total_revenue' => $totalRevenue,
        ];

        return response()->json($data);
    }
    public function getLeadStatusCounts(): JsonResponse
    {
        // Get count and sum of quoted price grouped by status
        $leadStatusData = Lead::selectRaw('status, COUNT(*) as count, SUM(quoted_price) as total_price')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => ['count' => $item->count, 'total_price' => $item->total_price]];
            });
    
        // Get total payment sum for status 5 (Won)
        $totalPaymentWon = Lead::where('status', 5)->sum('total_payment');
    
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
