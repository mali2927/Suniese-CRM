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
        ], 422)
        ;
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
    
    // Return the token as part of the JSON response
    return response()->json([
        'message' => 'Login successful',
        'token' => $token // Include token in response body
    ], 200)->cookie('token', $token, 60*24); // Optionally still set the token as a cookie
    
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


        log::debug($request);


    }

}