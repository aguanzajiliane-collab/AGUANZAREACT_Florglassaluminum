<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{AuthController,CategoryController,DashboardController,ProductController,QuotationRequestController};

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::get('/categories',[CategoryController::class,'index']);
Route::get('/products',[ProductController::class,'index']);
Route::get('/products/{product}',[ProductController::class,'show']);
Route::middleware('auth:sanctum')->group(function () {
 Route::post('/logout',[AuthController::class,'logout']); Route::get('/user',[AuthController::class,'user']);
 Route::get('/quotation-requests',[QuotationRequestController::class,'index']); Route::post('/quotation-requests',[QuotationRequestController::class,'store']); Route::get('/quotation-requests/{quotation_request}',[QuotationRequestController::class,'show']); Route::put('/quotation-requests/{quotation_request}',[QuotationRequestController::class,'update']); Route::delete('/quotation-requests/{quotation_request}',[QuotationRequestController::class,'destroy']); Route::patch('/quotation-requests/{quotation_request}/accept',[QuotationRequestController::class,'accept']);
 Route::middleware('admin')->group(function () { Route::get('/dashboard',DashboardController::class); Route::apiResource('categories',CategoryController::class)->except('index'); Route::apiResource('products',ProductController::class)->except(['index','show']); Route::patch('/quotation-requests/{quotation_request}/status',[QuotationRequestController::class,'updateStatus']); Route::get('/customers',fn()=>\App\Http\Resources\UserResource::collection(\App\Models\User::where('role','customer')->paginate(10))); });
});
