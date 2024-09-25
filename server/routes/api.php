<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\LeadStatusController;
use App\Http\Controllers\LeadReportController;
use App\Http\Controllers\DashboardController;


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
Route::get('/showUsersForReportInLeads', [UserController::class, 'showUsersForReportInLeads']);


//Leads APIS

Route::post('/leads', [LeadController::class, 'store']);
Route::get('/leads', [LeadController::class, 'index']);
Route::put('/update-lead/{id}', [LeadController::class, 'update']);
Route::put('/leads/{id}/status', [LeadController::class, 'updateStatus']);
Route::put('/leads/{id}/payment', [LeadController::class, 'updatePayment']);


//Leads Statuses
Route::get('/lead-statuses', [LeadStatusController::class, 'index']);
Route::get('/searchLeadByConsultantId', [LeadController::class, 'searchLeadByConsultantId']);

// Lead Pdf

Route::get('/leads/{id}/report', [LeadReportController::class, 'generateReport']);
 // Dashboard API

 Route::get('/dashboard-report', [DashboardController::class, 'getDashboardReport']);
 Route::get('/lead-status-counts', [DashboardController::class, 'getLeadStatusCounts']);
 Route::get('/weekly-lead-data', [DashboardController::class, 'getWeeklyLeadData']);

