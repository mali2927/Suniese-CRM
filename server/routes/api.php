<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/userRegister', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/handleSession', [UserController::class, 'handleSession']);
Route::post('/addUser', [UserController::class, 'addUser']);