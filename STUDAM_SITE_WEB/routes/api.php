<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstPresentController;

// Route::post('/estpresent/store', [EstPresentController::class, 'store']);
Route::post('/estpresent', [EstPresentController::class, 'store']);