<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Departement;
use App\Models\Horaire;
use App\Models\Enseignant;
use App\Models\Matiere;
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
        try {
            Log::info('Données reçues:', $request->all());

            $validator = Validator::make($request->all(), [
                'nom_matiere' => 'required|string|max:255',
                'code_matiere' => 'required|string|max:50',
                'classe_id' => 'required|exists:classes,id',
                'jour' => 'required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
                'heure' => 'required|string',
                'enseignant_id' => 'nullable|exists:enseignants,id',
                'nouveau_enseignant' => 'required_without:enseignant_id|array',
                'nouveau_enseignant.nom' => 'required_without:enseignant_id|string|max:255',
                'nouveau_enseignant.email' => 'required_without:enseignant_id|email|unique:enseignants,email',
                'nouveau_enseignant.password' => 'required_without:enseignant_id|string|min:6',
            ], [
                'nom_matiere.required' => 'Le nom de la matière est requis',
                'code_matiere.required' => 'Le code de la matière est requis',
                'jour.required' => 'Le jour est requis',
                'jour.in' => 'Le jour sélectionné n\'est pas valide',
                'heure.required' => 'L\'heure est requise',
                'nouveau_enseignant.nom.required_without' => 'Le nom de l\'enseignant est requis si vous n\'en sélectionnez pas un existant',
                'nouveau_enseignant.email.required_without' => 'L\'email de l\'enseignant est requis si vous n\'en sélectionnez pas un existant',
                'nouveau_enseignant.email.unique' => 'Cet email est déjà utilisé par un autre enseignant',
                'nouveau_enseignant.password.required_without' => 'Le mot de passe est requis si vous n\'en sélectionnez pas un existant',
                'nouveau_enseignant.password.min' => 'Le mot de passe doit faire au moins 6 caractères',
            ]);

            if ($validator->fails()) {
                Log::warning('Erreurs de validation:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

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

            // Vérifier si un horaire existe déjà pour ce créneau
            $existingHoraire = Horaire::where([
                'classe_id' => $request->classe_id,
                'jour' => $request->jour,
                'heure_debut' => $request->heure,
            ])->first();

            if ($existingHoraire) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'horaire' => ['Ce créneau horaire est déjà occupé']
                    ]
                ], 422);
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

            DB::commit();

            return response()->json([
                'success' => true,
                'matiere' => $matiere->load('enseignant'),
                'message' => 'Matière et horaire ajoutés avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => ['general' => ['Une erreur est survenue lors de l\'enregistrement: ' . $e->getMessage()]]
            ], 500);
        }
    }
}
