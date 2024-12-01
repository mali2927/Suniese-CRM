<?php

namespace App\Http\Controllers;

use App\Models\InquiryForm;
use Illuminate\Http\Request;

class InquiryFormController extends Controller
{
    // Display all inquiry forms
    public function index()
    {
        $inquiries = InquiryForm::all(); // Fetch all the inquiries
        return view('inquiry_forms.index', compact('inquiries')); // Return the view with data
    }

    // Store a new inquiry form
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'full_address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'homeowner_status' => 'required|in:owner,tenant',
        ]);

        // Store the inquiry form
        InquiryForm::create([
            'full_name' => $validated['full_name'],
            'full_address' => $validated['full_address'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'homeowner_status' => $validated['homeowner_status'],
            'user_id' => auth()->id(), // Assuming the user is logged in
        ]);

        return redirect()->route('inquiries.index')->with('success', 'Inquiry Form Created!');
    }

    // Show the form for editing the inquiry
    public function edit($id)
    {
        $inquiry = InquiryForm::findOrFail($id);
        return view('inquiry_forms.edit', compact('inquiry'));
    }

    // Update an existing inquiry form
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'full_address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'homeowner_status' => 'required|in:owner,tenant',
        ]);

        $inquiry = InquiryForm::findOrFail($id);
        $inquiry->update($validated);

        return redirect()->route('inquiries.index')->with('success', 'Inquiry Form Updated!');
    }

    // Delete the inquiry form
    public function destroy($id)
    {
        $inquiry = InquiryForm::findOrFail($id);
        $inquiry->delete();

        return redirect()->route('inquiries.index')->with('success', 'Inquiry Form Deleted!');
    }
}
