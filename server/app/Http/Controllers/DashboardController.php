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
        $totalRevenue = Lead::sum('total_payment');

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
        // Get count of leads grouped by status
        $leadStatusCounts = Lead::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Create a response with status IDs mapped to their names
        $data = [
            'hot' => $leadStatusCounts[1] ?? 0,   // Status ID 1 = Hot
            'cold' => $leadStatusCounts[2] ?? 0,  // Status ID 2 = Cold
            'warm' => $leadStatusCounts[3] ?? 0,  // Status ID 3 = Warm
            'lost' => $leadStatusCounts[4] ?? 0,  // Status ID 4 = Lost
            'won' => $leadStatusCounts[5] ?? 0,   // Status ID 5 = Won
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
