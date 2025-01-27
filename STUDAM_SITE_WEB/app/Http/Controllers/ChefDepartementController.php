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

    public function editEmploiTemps($classe)
    {
        $classe = Classe::with('matieres')->findOrFail($classe);
        $enseignants = Enseignant::where('departement_id', auth()->user()->departement_id)->get();
        
        return view('chef_departement.emploi_temps', compact('classe', 'enseignants'));
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
        $matiere_id = $request->input('matiere_id');
        $enseignants = Enseignant::where('departement_id', auth()->user()->departement_id)
            ->whereHas('matieres', function($query) use ($matiere_id) {
                $query->where('matieres.id', $matiere_id);
            })
            ->get();
            
        return response()->json($enseignants);
    }

    public function storeMatiereEnseignant(Request $request)
    {
        $request->validate([
            'horaire_id' => 'required|exists:horaires,id',
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id',
        ]);

        // Récupérer la matière avec son enseignant
        $matiere = Matiere::with('enseignant')->findOrFail($request->matiere_id);
        
        if (!$matiere->enseignant) {
            return response()->json(['message' => 'Cette matière n\'a pas d\'enseignant assigné'], 422);
        }

        // Vérifier si l'horaire est déjà assigné
        $existingAssignment = HoraireClasseMatiere::where('horaire_id', $request->horaire_id)
            ->where('classe_id', $request->classe_id)
            ->first();
            
        if ($existingAssignment) {
            $existingAssignment->update([
                'matiere_id' => $request->matiere_id,
                'enseignant_id' => $matiere->enseignant->id,
            ]);
        } else {
            HoraireClasseMatiere::create([
                'horaire_id' => $request->horaire_id,
                'classe_id' => $request->classe_id,
                'matiere_id' => $request->matiere_id,
                'enseignant_id' => $matiere->enseignant->id,
            ]);
        }

        return response()->json(['message' => 'Matière assignée avec succès']);
    }
}
