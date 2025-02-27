<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Str;// Make sure to include the Log facade

class UserController extends Controller
{
    
    public function login(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Attempt to find the user by email
        $user = User::where('email', $request->input('email'))->first();
        
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }
        
        // Generate a new token
        $token = Str::random(60);
        
        // Save the token in the database
        $user->api_token = hash('sha256', $token);
        $user->save();
        
        // Return the token and role as part of the JSON response
        return response()->json([
            'message' => 'Login successful',
            'token' => $token, // Include token in response body
            'role' => $user->role, // Include role in response body
            'id' => $user->id
        ], 200)->cookie('token', $token, 60 * 24); // Optionally still set the token as a cookie
    }
    
    public function changePassword(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'old_password' => 'required|min:6',
            'new_password' => 'required|min:6|different:old_password',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
    
        // Attempt to find the user by email
        $user = User::where('email', $request->input('email'))->first();
    
        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }
    
        // Check if old password matches
        if (!Hash::check($request->input('old_password'), $user->password)) {
            return response()->json([
                'message' => 'Old password does not match.'
            ], 401);
        }
    
        // Update the password
        $user->password = Hash::make($request->input('new_password'));
        $user->save();
    
        // Return a success response
        return response()->json([
            'message' => 'Password updated successfully.'
        ], 200);
    }
        public function register(Request $request)
        {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'role' => 'nullable|string|max:15',
            ]);
        
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422);
            }
        
            // Extract data from request
            $email = $request->input('email');
            $password = $request->input('password');
            $role = $request->input('role'); // Default to null if not provided
        
            // Log the received data (for debugging purposes)
            Log::info('Email: ' . $email);
            Log::info('Password: ' . $password);
            Log::info('Role: ' . $role);

            $user = new User();
            $user->email = $email;
            $user->password = Hash::make($password); // Store the encrypted password
            $user->role = $role;
            $user->save();
          
            // Return a success response
            return response()->json([
                'message' => 'User registered successfully!',
                'user' => $user
            ], 201);
        }
    
    
        public function handleSession(Request $request)
        {
            $request->validate([
                'token' => 'required|string',
                'email' => 'required|string|email',
            ]);
    
            $token = $request->input('token');
            $email = $request->input('email');
    
            // Hash the token to match the stored hashed token
            $hashedToken = hash('sha256', $token);
    
            $user = User::where('email', $email)->where('api_token', $hashedToken)->first();
            if ($user) {
                return response()->json([
                    'isAuthenticated' => true,
                    'role' => $user->role // or replace with the actual method/attribute to get the role
                ]);
            } else {
                return response()->json(['isAuthenticated' => false], 401);
            }    
    }
    public function addUser(Request $request)
    {
        // Check if the email is already registered
        $existingUser = User::where('email', $request->input('email'))->first();
    
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'message' => 'The email address is already registered.',
            ], 422); // 422 Unprocessable Entity
        }
    
        // Create a new user
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->role = $request->input('designation');
        $user->password = Hash::make('123456789'); // Default password
        $user->status = 'Active';
        $user->save(); // Save to generate the user ID
    
        // Retrieve the base URL from the configuration
        $baseUrl = config('app.url');
    
        // Set the inquiry link based on the user's ID
        $user->inquiry_link = "/inquiryform/{$user->id}";
        $user->save(); // Save again to update the inquiry link
    
        return response()->json([
            'success' => true,
            'message' => 'User created successfully!',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'inquiry_link' => $user->inquiry_link, // Return the inquiry link
            ]
        ]);
    }
    
    


    public function updateUser(Request $request)
    {


        try {
            // Retrieve the user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found.',
                ], 404); // Not Found
            }

            // Update the user's details
            $user->name = $request->name;
            $user->role = $request->designation; // Assuming 'role' corresponds to 'designation'
            $user->status = $request->active ? 1 : 0; // Assuming 'status' is stored as integer

            // Save the changes
            $user->save();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'designation' => $user->role,
                    'active' => (bool) $user->status,
                ],
            ], 200); // OK

        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the user.',
                'error' => $e->getMessage(),
            ], 500); // Internal Server Error
        }
    }


    public function showUsers()
    {
        // Retrieve emails, roles, and status of all users except 'SuperAdmin' and 'Admin'
        $users = User::whereNotIn('role', ['SuperAdmin', 'Admin'])
                     ->select('name','email', 'role', 'status','id')
                     ->get();
    
        // Return the result as a JSON response
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function showAllUsers()
    {
        // Retrieve all users
        $users = User::all(); // Select all users with *
    
        // Return the result as a JSON response
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function showUsersForReportInLeads(){


        $users = User::whereNotIn('role', ['SuperAdmin', 'Admin'])
                     ->select('id','name', 'role', 'status')
                     ->get();
    
        // Return the result as a JSON response
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
    public function deleteUser(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:users,id',
        ]);

        try {
            $user = User::findOrFail($request->id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user. Please try again.',
            ], 500);
        }
    }
    




}