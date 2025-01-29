<?php

namespace App\Http\Controllers;

use App\Models\Horaire;
use App\Models\Etudiant;
use App\Models\Estpresent;
use Illuminate\Support\Facades\DB;

class PresenceController extends Controller
{
    public function export($horaireId)
    {
        $horaire = Horaire::findOrFail($horaireId);
        
        // Récupérer tous les étudiants
        $etudiants = Etudiant::all();
        
        // Récupérer toutes les présences pour cet horaire
        $presences = Estpresent::where('horaire_id', $horaireId)
            ->get()
            ->groupBy('date')
            ->map(function ($presences) {
                return $presences->pluck('etudiant_id')->toArray();
            });
        
        // Préparer les en-têtes du CSV
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="presences_' . $horaire->nom . '.csv"',
        ];
        
        // Créer le fichier CSV
        $handle = fopen('php://temp', 'w+');
        
        // Écrire l'en-tête
        $headerRow = ['Matricule', 'Nom et Prénoms'];
        foreach ($presences->keys() as $date) {
            $headerRow[] = $date;
        }
        $headerRow[] = 'Total';
        fputcsv($handle, $headerRow);
        
        // Écrire les données pour chaque étudiant
        foreach ($etudiants as $etudiant) {
            $row = [
                $etudiant->matricule,
                $etudiant->nom . ' ' . $etudiant->prenom
            ];
            
            $totalAbsences = 0;
            foreach ($presences as $date => $presentEtudiants) {
                $isPresent = in_array($etudiant->id, $presentEtudiants) ? 0 : 1;
                $row[] = $isPresent;
                $totalAbsences += $isPresent;
            }
            
            $row[] = $totalAbsences;
            fputcsv($handle, $row);
        }
        
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        
        return response($content, 200, $headers);
    }
}