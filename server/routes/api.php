<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LeadController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/userRegister', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/handleSession', [UserController::class, 'handleSession']);
// User APIS
Route::post('/addUser', [UserController::class, 'addUser']);
Route::post('/editUser', [UserController::class, 'editUser']);
Route::post('/showUsers', [UserController::class, 'showUsers']);
Route::post('/showAllUsers', [UserController::class, 'showAllUsers']);
Route::put('/updateUser', [UserController::class, 'updateUser']);

//Leads APIS

Route::post('/leads', [LeadController::class, 'store']);
Route::get('/leads', [LeadController::class, 'index']);



