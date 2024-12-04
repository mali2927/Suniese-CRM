<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InquiryForm;

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
}
