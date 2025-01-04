<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Departement;
use App\Models\Horaire;
use App\Models\Enseignant;
use App\Models\Matiere;
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

    public function getEnseignants(Request $request)
    {
        $search = $request->get('search');
        $enseignants = Enseignant::where('nom', 'LIKE', "%{$search}%")->get();
        return response()->json($enseignants);
    }

    public function storeMatiereEnseignant(Request $request)
    {
        $request->validate([
            'nom_matiere' => 'required|string|max:255',
            'code_matiere' => 'required|string|max:50',
            'classe_id' => 'required|exists:classes,id',
            'jour' => 'required|string',
            'heure' => 'required|string',
            'enseignant_id' => 'nullable|exists:enseignants,id',
            'nouveau_enseignant' => 'required_without:enseignant_id|array',
            'nouveau_enseignant.nom' => 'required_without:enseignant_id|string|max:255',
            'nouveau_enseignant.email' => 'required_without:enseignant_id|email|unique:enseignants,email',
            'nouveau_enseignant.password' => 'required_without:enseignant_id|string|min:6',
        ]);

        // Créer ou récupérer l'enseignant
        if ($request->enseignant_id) {
            $enseignant = Enseignant::findOrFail($request->enseignant_id);
        } else {
            $enseignant = Enseignant::create([
                'nom' => $request->nouveau_enseignant['nom'],
                'email' => $request->nouveau_enseignant['email'],
                'password' => bcrypt($request->nouveau_enseignant['password']),
                'departement_id' => auth()->user()->departement_id
            ]);
        }

        // Créer la matière
        $matiere = Matiere::create([
            'libelle' => $request->nom_matiere,
            'code' => $request->code_matiere,
            'enseignant_id' => $enseignant->id,
            'classe_id' => $request->classe_id
        ]);

        // Créer l'horaire
        $horaire = Horaire::create([
            'classe_id' => $request->classe_id,
            'jour' => $request->jour,
            'heure_debut' => $request->heure,
            'matiere_id' => $matiere->id
        ]);

        return response()->json([
            'success' => true,
            'matiere' => $matiere->load('enseignant'),
            'message' => 'Matière et horaire ajoutés avec succès'
        ]);
    }
}
