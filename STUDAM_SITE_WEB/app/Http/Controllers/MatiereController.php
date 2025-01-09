<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Matiere;

class MatiereController extends Controller
{
    public function store(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'libelle' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'enseignant_id' => 'nullable|exists:enseignants,id',
            'classe_id' => 'required|exists:classes,id',
        ]);

        // Créer une nouvelle matière
        Matiere::create([
            'libelle' => $request->libelle,
            'code' => $request->code,
            'enseignant_id' => $request->enseignant_id,
            'classe_id' => $request->classe_id,
        ]);

        // Rediriger avec un message de succès
        return redirect()->route('chef_departement.index')->with('success', 'Matière ajoutée avec succès.');
    }
}