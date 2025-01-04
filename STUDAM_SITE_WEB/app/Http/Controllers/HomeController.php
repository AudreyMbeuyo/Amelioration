<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Classe;
use App\Models\Enseignant;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('index');
    }

    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return view('home');
    }

    public function dashboard()
    {
        $enseignant = auth()->user();
        
        // Charger la relation département si l'enseignant est un chef de département
        if ($enseignant->departement_id !== null) {
            $enseignant->load('departement');
        }
        
        // Charger les matières de l'enseignant
        $matieres = $enseignant->matieres;
        
        // Charger les classes liées aux matières de l'enseignant
        $classes = Classe::whereHas('matieres', function($query) use ($enseignant) {
            $query->where('enseignant_id', $enseignant->id);
        })->get();
        
        return view('dashboard', compact('enseignant', 'matieres', 'classes'));
    }
}
