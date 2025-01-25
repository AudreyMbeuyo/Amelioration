<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Departement;
use App\Models\Horaire;
use App\Models\Enseignant;
use App\Models\Matiere;
use App\Models\HoraireClasseMatiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ChefDepartementController extends Controller
{
    public function index()
    {
        $departement = auth()->user()->departement;
        $classes = Classe::where('departement_id', $departement->id)
            ->withCount(['etudiants', 'matieres'])
            ->get();        
        $enseignants = Enseignant::all();
        $matieres = Matiere::whereHas('classes', function($query) use ($departement) {
            $query->where('departement_id', $departement->id);
        })->orderBy('libelle')->get();        
        return view('chef_departement.index', compact('departement', 'classes', 'matieres', 'enseignants'));
    }

    public function editEmploiTemps($classe_id)
{
    $classe = Classe::findOrFail($classe_id);
        
    // Vérifier que la classe appartient bien au département du chef
    if ($classe->departement_id !== auth()->user()->departement_id) {
        return redirect()->route('chef_departement.index')
                       ->with('error', 'Vous n\'avez pas accès à cette classe.');
    }

    $horaires = HoraireClasseMatiere::where('classe_id', $classe_id)->get();
        
    return view('chef_departement.emploi_temps', compact('classe', 'horaires'));
}

public function updateEmploiTemps(Request $request, $classe_id)
{
    $classe = Classe::findOrFail($classe_id);
        
    // Supprimer les anciens horaires
    HoraireClasseMatiere::where('classe_id', $classe_id)->delete();
        
    // Ajouter les nouveaux horaires
    foreach ($request->horaires as $jour => $creneaux) {
        foreach ($creneaux as $heure => $matiere) {
            if (!empty($matiere)) {
                HoraireClasseMatiere::create([
                    'horaire_id' => $heure,
                    'classe_id' => $classe_id,
                    'matiere_id' => $matiere
                ]);
            }
        }
    }
        
    return redirect()->route('chef_departement.index')->with('success', 'Emploi du temps mis à jour avec succès');
}

    public function getEnseignants(Request $request)
    {
        $search = $request->get('search');
        $enseignants = Enseignant::where('nom', 'LIKE', "%{$search}%")->get();
        return response()->json($enseignants);
    }

}
