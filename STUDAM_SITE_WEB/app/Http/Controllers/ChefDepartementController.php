<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Departement;
use App\Models\Horaire;
use Illuminate\Http\Request;

class ChefDepartementController extends Controller
{
    public function index()
    {
        $departement = auth()->user()->departement;
        $classes = Classe::where('departement_id', $departement->id)->get();
        
        return view('chef_departement.index', compact('departement', 'classes'));
    }

    public function editEmploiTemps($classe_id)
    {
        $classe = Classe::findOrFail($classe_id);
        
        // Vérifier que la classe appartient bien au département du chef
        if ($classe->departement_id !== auth()->user()->departement_id) {
            return redirect()->route('chef_departement.index')
                           ->with('error', 'Vous n\'avez pas accès à cette classe.');
        }

        $horaires = Horaire::where('classe_id', $classe_id)->get();
        
        return view('chef_departement.emploi_temps', compact('classe', 'horaires'));
    }

    public function updateEmploiTemps(Request $request, $classe_id)
    {
        $classe = Classe::findOrFail($classe_id);
        
        // Supprimer les anciens horaires
        Horaire::where('classe_id', $classe_id)->delete();
        
        // Ajouter les nouveaux horaires
        foreach ($request->horaires as $jour => $creneaux) {
            foreach ($creneaux as $heure => $matiere) {
                if (!empty($matiere)) {
                    Horaire::create([
                        'classe_id' => $classe_id,
                        'jour' => $jour,
                        'heure_debut' => $heure,
                        'matiere_id' => $matiere
                    ]);
                }
            }
        }
        
        return redirect()->route('chef_departement.index')->with('success', 'Emploi du temps mis à jour avec succès');
    }
}
