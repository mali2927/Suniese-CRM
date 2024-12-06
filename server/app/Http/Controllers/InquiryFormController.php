<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InquiryForm;
use App\Models\User;


class InquiryFormController extends Controller
{
    /**
     * Store a new inquiry.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $user_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $user_id)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'fullName' => 'required|string|max:255',
            'fullAddress' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phoneNumber' => 'required|string|max:15',
            'homeownerStatus' => 'required|in:owner,tenant',
        ]);

        try {
            // Save the inquiry to the database
            $inquiry = InquiryForm::create([
                'full_name' => $validatedData['fullName'],
                'full_address' => $validatedData['fullAddress'],
                'email' => $validatedData['email'],
                'phone_number' => $validatedData['phoneNumber'],
                'homeowner_status' => $validatedData['homeownerStatus'],
                'user_id' => $user_id,
            ]);

            return response()->json([
                'message' => 'Thank you for submitting your inquiry!',
                'inquiry' => $inquiry,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while submitting the inquiry.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getInquiryLink(Request $request)
    {
        // Get the user_id from the request
        $userId = $request->input('user_id'); // Get user_id from the request payload
    
        // Find the user by the user_id
        $user = User::find($userId);
    
        if ($user) {
            // Dynamically attach the base URL with the port to the inquiry link
            $baseUrl = config('app.url');
            $fullInquiryLink = "{$baseUrl}:3000{$user->inquiry_link}";
    
            return response()->json(['inquiry_link' => $fullInquiryLink]);
        }
    
        return response()->json(['message' => 'User not found'], 404);
    }
    
    
    public function getInquiriesByUser(Request $request)
    {
        $userId = $request->user_id;

        if (!$userId) {
            return response()->json(['error' => 'User ID is required.'], 400);
        }

        // Fetch inquiries by user_id
        $inquiries = InquiryForm::where('user_id', $userId)->get();

        return response()->json($inquiries);
    }
    

}
