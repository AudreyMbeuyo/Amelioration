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

        $jours = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
        
        foreach ($jours as $jour) {
            // Créer un horaire pour chaque jour
            Horaire::create([
                'jour' => $jour,
                'heure_debut' => $validated['heure_debut'],
                'heure_fin' => $validated['heure_fin'],
            ]);
        }

        return response()->json(['message' => 'Horaires ajoutés avec succès!']);
    }
}
