<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lead;

class UserDashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $email = $request->input('email');
        
        // Fetch the user based on the email
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get the total leads count for the user
        $totalLeads = Lead::where('user_id', $user->id)->count();

        // Get total revenue from won leads for the user (assuming status ID 5 corresponds to 'won')
        $totalRevenue = Lead::where('user_id', $user->id)->where('status', 5)->sum('total_payment');

        return response()->json([
            'salesConsultantName' => $user->name,
            'totalLeads' => $totalLeads,
            'totalRevenue' => $totalRevenue,
        ]);
    }
}
