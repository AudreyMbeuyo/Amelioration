<?php
/*namespace App\Http\Controllers;

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
            'enseignant_id' => 'nullable|exists:users,id',
            'classe_id' => 'required|array', // Plusieurs classes
            'classe_id.*' => 'exists:classes,id', // Vérifie que chaque classe existe
        ]);
    
        // Créer une nouvelle matièrel
        $matiere = Matiere::create([
            'libelle' => $request->libelle,
            'code' => $request->code,
            'enseignant_id' => $request->enseignant_id,
        ]);
    
        // Attacher les classes sélectionnées à la matière
        $matiere->classes()->attach($request->classe_id);
    
        // Rediriger avec un message de succès
        return redirect()->route('chef_departement.index')->with('success', 'Matière ajoutée et associée aux classes avec succès.');
    }
    
}
 */
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Matiere;
use Illuminate\Support\Facades\Log;

class MatiereController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log pour debug
            Log::info('Données reçues:', $request->all());

            // Valider les données du formulaire
            $validated = $request->validate([
                'libelle' => 'required|string|max:255',
                'code' => 'required|string|max:255',
                'departement_id' => 'required|exists:departements,id', // Ajout de cette validation
                'enseignant_id' => 'nullable|exists:users,id',
                'classe_id' => 'required|array',
                'classe_id.*' => 'exists:classes,id',
            ]);

            // Créer une nouvelle matière
            $matiere = Matiere::create([
                'libelle' => $request->libelle,
                'code' => $request->code,
                'enseignant_id' => $request->enseignant_id,
            ]);

            // Attacher les classes sélectionnées à la matière
            if ($request->has('classe_id')) {
                $matiere->classes()->attach($request->classe_id);
            }

            return redirect()->route('chef_departement.index')
                           ->with('success', 'Matière ajoutée et associée aux classes avec succès.');

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout de la matière:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                           ->withInput()
                           ->withErrors(['error' => 'Erreur lors de l\'ajout de la matière: ' . $e->getMessage()]);
        }
    }

    public function showPresences(Matiere $matiere)
    {
        return view('presences.download', compact('matiere'));
    }
}