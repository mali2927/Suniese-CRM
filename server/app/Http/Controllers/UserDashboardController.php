<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;
use Carbon\Carbon;

class UserDashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $email = $request->input('email');
        $startDate = Carbon::parse($request->query('start_date', '1970-01-01'))->startOfDay();
        $endDate = Carbon::parse($request->query('end_date', Carbon::now()))->endOfDay();

        // Fetch the user based on the email
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get the total leads count for the user within the date range
        $totalLeads = Lead::where('user_id', $user->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Get total revenue from won leads for the user within the date range
        $totalRevenue = Lead::where('user_id', $user->id)
            ->where('status', 5) // Assuming status 5 corresponds to 'won'
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_payment');

        // Get total number of won leads for the user within the date range
        $wonLeads = Lead::where('user_id', $user->id)
            ->where('status', 5)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return response()->json([
            'salesConsultantName' => $user->name,
            'totalLeads' => $totalLeads,
            'totalRevenue' => $totalRevenue,
            'wonLeads' => $wonLeads,
        ]);
    }
}
