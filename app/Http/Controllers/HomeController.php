<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Enseignant;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
        $enseignant = Auth::user();
        $matieres = $enseignant->matieres;
        $classes = Classe::whereHas('matieres', function($query) use ($enseignant) {
            $query->where('enseignant_id', $enseignant->id);
        })->get();

        return view('dashboard', [
            'matieres' => $matieres,
            'classes' => $classes,
            'enseignant' => $enseignant
        ]);
    }
}
