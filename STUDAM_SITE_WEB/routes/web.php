<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ChefDepartementController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\HoraireController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Routes d'authentification
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Route pour la gestion des horaires
Route::post('/horaire', [HoraireController::class, 'store'])->name('horaire.store');

// Routes pour le chef de département (protégées)
Route::middleware(['auth', \App\Http\Middleware\ChefDepartementMiddleware::class])->group(function () {
    Route::get('/chef-departement', [ChefDepartementController::class, 'index'])->name('chef_departement.index');
    Route::get('/chef-departement/emploi-temps/{classe}', [ChefDepartementController::class, 'editEmploiTemps'])->name('chef_departement.emploi_temps');
    Route::get('/chef-departement/emploi-temps/{classe}/export-pdf', [ChefDepartementController::class, 'exportPDF'])->name('chef_departement.export_pdf');
    Route::put('/chef-departement/emploi-temps/{classe}', [ChefDepartementController::class, 'updateEmploiTemps'])->name('chef_departement.update_emploi_temps');
    Route::get('/chef-departement/enseignants', [ChefDepartementController::class, 'getEnseignants'])->name('chef_departement.get_enseignants');
    Route::post('/chef-departement/matiere-enseignant', [ChefDepartementController::class, 'storeMatiereEnseignant'])->name('chef_departement.store_matiere_enseignant');
    Route::post('/chef-departement/matieres', [MatiereController::class, 'store'])->name('matieres.store');
    Route::post('/chef-departement/enseignants', [MatiereController::class, 'store'])->name('enseignants.store');
});

// Routes protégées
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'dashboard'])->name('dashboard');
});
