<?php

namespace App\Http\Controllers;

use Carbon\Traits\ToStringFormat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\Horaire;
use App\Models\Estpresent;

class EstPresentController extends Controller
{
    public function store(Request $request){
        $data = $this->formatJson($request->getContent());
        error_log('Raw Request Content: ' . $request->getContent());
        if ($data === null) {
            return response()->json(['message' => 'Invalid data format'], 400);
        }
        
        $validated = Validator::make($data, [
            'id' => 'required|string|max:255',
            'timestamp' => 'required|date',
            'teacher' => 'required|string|max:255',
        ])->validate();

        error_log('Validated data: ' . json_encode($validated));

        // Trouver l'enseignant par son matricule
        // Add detailed error logging
        $enseignant = Enseignant::where('matricule', $validated['teacher'])->first();
        if (!$enseignant) {
            error_log('Enseignant query failed');
            error_log('Total Enseignant count: ' . Enseignant::count());
            
            // Print all existing matricules for debugging
            $allMatricules = Enseignant::pluck('matricule')->toArray();
            error_log('Existing matricules: ' . json_encode($allMatricules));
        }
        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant non trouvé'], 404);
        }

        // Trouver l'étudiant par son matricule
        $etudiant = Etudiant::where('matricule', $validated['id'])->first();
        if (!$etudiant) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        // Analyser le timestamp pour trouver la plage horaire et le jour
        $timestamp = new \DateTime($validated['timestamp']);
        $jour = $timestamp->format('l'); // Jour de la semaine
        $heure = $timestamp->format('H:i:s'); // Heure

        error_log("Searching Horaire for:");
        error_log("Day: " . $jour);
        error_log("Time: " . $heure);

        $jourMapping = [  
            'LUNDI' => 'Monday',
            'MARDI' => 'Tuesday',
            'MERCREDI' => 'Wednesday',
            'VENDREDI' => 'Friday',
            // Add other mappings
        ];
        
        $englishJour = $jourMapping[$jour] ?? $timestamp->format('l');
        
        $horaire = Horaire::where('jour', 'LIKE', '%VENDREDI%')
            ->where(function($query) use ($heure) {
                $query->where('heure_debut', '<=', $heure)
                    ->where('heure_fin', '>=', $heure);
            })
            ->first();

        if (!$horaire) {
            error_log('No matching horaire found for time: ' . $heure);
        }

        // $horaire = Horaire::where('jour', $englishJour)
        //     ->where('heure_debut', '<=', $heure)
        //     ->where('heure_fin', '>=', $heure)
        //     ->first();

        // if (!$horaire) {
        //     error_log('Total Horaire count: ' . Horaire::count());
        //     $allHoraires = Horaire::all();
        //     foreach ($allHoraires as $h) {
        //         error_log("Existing Horaire: Jour={$h->jour}, Début={$h->heure_debut}, Fin={$h->heure_fin}");
        //     }
        // }
        // // Trouver la plage horaire correspondante
        // $horaire = Horaire::where('jour', $jour)
        //     ->where('heure_debut', '<=', $heure)
        //     ->where('heure_fin', '>=', $heure)
        //     ->first();
        //     if (!$horaire) {
        //         return response()->json(['message' => 'Horaire non trouvé'], 404);
        //     }
    
        // Créer l'enregistrement dans la table `estpresents`
        $present = Estpresent::create([
            'date' => $timestamp->format('Y-m-d'), // Extraire la date
            'horaire_id' => $horaire->id,
            'etudiant_id' => $etudiant->id,
            'enseignant_id' => $enseignant->id,
        ]);
    
        return response()->json([
            'message' => 'Présence enregistrée avec succès !',
            'data' => $present,
        ], 201);
    }

    function formatJson($data) {
        // If data is a string, try to parse it
        if (is_string($data)) {
            try {
                $data = json_decode($data, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return null;
                }
            } catch (\Exception $e) {
                return null;
            }
        }
        
        // Validate required keys exist
        if (!isset($data['id']) || !isset($data['teacher']) || !isset($data['timestamp'])) {
            return null;
        }
        
        // Remove carriage returns and trim
        $data['id'] = trim(str_replace("\r", '', $data['id']));
        $data['teacher'] = trim(str_replace("\r", '', $data['teacherId']));
        
        // Convert timestamp
        $timestamp = str_replace(['--', '.'], [' ', '-'], $data['timestamp']);
        $date = \DateTime::createFromFormat('d-m-Y H:i:s', $timestamp);
        
        if ($date) {
            return [
                'id' => $data['id'],
                'teacher' => $data['teacher'],
                'timestamp' => $date->format('Y-m-d H:i:s')
            ];
        }
        
        return null;
    }

}
