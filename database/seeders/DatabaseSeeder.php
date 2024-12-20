<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;
use App\Models\Enseignant;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Etudiant;
use App\Models\Horaire;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Création des départements
        $departementInfo = Departement::create(['nom' => 'Informatique']);
        $departementGc = Departement::create(['nom' => 'Génie Civil']);

        // Création des enseignants
        $enseignant1 = Enseignant::create([
            'nom' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departementInfo->id
        ]); 

        $enseignant2 = Enseignant::create([
            'nom' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departementGc->id
        ]);

        // Création des horaires
        $horaire1 = Horaire::create([
            'jour' => 'LUNDI',
            'heure_debut' => '08:00',
            'heure_fin' => '10:00'
        ]);

        $horaire2 = Horaire::create([
            'jour' => 'MARDI',
            'heure_debut' => '10:00',
            'heure_fin' => '12:00'
        ]);

        // Création des classes
        $classe1 = Classe::create([
            'nom' => 'L3 Informatique',
            'departement_id' => $departementInfo->id
        ]);

        $classe2 = Classe::create([
            'nom' => 'L3 Génie Civil',
            'departement_id' => $departementGc->id
        ]);

        // Création des matières
        $matiere1 = Matiere::create([
            'libelle' => 'Programmation Web',
            'code' => 'INFO301',
            'horaire_id' => $horaire1->id,
            'enseignant_id' => $enseignant1->id
        ]);

        $matiere2 = Matiere::create([
            'libelle' => 'Base de données',
            'code' => 'INFO302',
            'horaire_id' => $horaire2->id,
            'enseignant_id' => $enseignant1->id
        ]);

        // Association des matières aux classes
        $matiere1->classes()->attach($classe1);
        $matiere2->classes()->attach($classe1);

        // Création des étudiants
        $etudiant1 = Etudiant::create([
            'matricule' => 'ETU001',
            'nom' => 'Alice Johnson',
            'prenom' => 'Alice'
        ]);

        $etudiant2 = Etudiant::create([
            'matricule' => 'ETU002',
            'nom' => 'Bob Wilson',
            'prenom' => 'Bob'
        ]);

        // Association des étudiants aux classes
        $classe1->etudiants()->attach([$etudiant1->id, $etudiant2->id]);
    }
}
