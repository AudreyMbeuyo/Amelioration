<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Horaire;

class HoraireController extends Controller
{
    public function store(Request $request)
    {
        // Valider les données
        $validated = $request->validate([
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            
        ]);

        // Créer un nouvel horaire
        Horaire::create($validated);

        // Rediriger avec un message de succès
        return redirect()->back()->with('success', 'Horaire ajouté avec succès!');
    }
}
