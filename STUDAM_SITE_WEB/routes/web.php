<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ChefDepartementController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Routes d'authentification
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Routes pour le chef de département (protégées)
Route::middleware(['auth', \App\Http\Middleware\ChefDepartementMiddleware::class])->group(function () {
    Route::get('/chef-departement', [ChefDepartementController::class, 'index'])->name('chef_departement.index');
    Route::get('/chef-departement/emploi-temps/{classe}', [ChefDepartementController::class, 'editEmploiTemps'])->name('chef_departement.emploi_temps');
    Route::put('/chef-departement/emploi-temps/{classe}', [ChefDepartementController::class, 'updateEmploiTemps'])->name('chef_departement.update_emploi_temps');
});

// Routes protégées
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');
});
