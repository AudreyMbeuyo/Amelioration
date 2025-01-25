<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;
use App\Models\Enseignant;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Etudiant;
use App\Models\Horaire;
use App\Models\HoraireClasseMatiere;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Création des départements
        $departementInfo = Departement::create(['nom' => 'Informatique']);
        $departementGc = Departement::create(['nom' => 'Génie Civil']);

        // Création des enseignants
        // Chef du département informatique
        $chefInfo = Enseignant::create([
            'nom' => 'John Doe',
            'email' => 'chef.info@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departementInfo->id  // Chef du département informatique
        ]); 

        // Chef du département génie civil
        $chefGc = Enseignant::create([
            'nom' => 'Jane Smith',
            'email' => 'chef.gc@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departementGc->id  // Chef du département génie civil
        ]);

        // Enseignants simples (sans département)
        $enseignant1 = Enseignant::create([
            'nom' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => null  // Enseignant simple
        ]);

        $enseignant2 = Enseignant::create([
            'nom' => 'Bob Wilson',
            'email' => 'bob@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => null  // Enseignant simple
        ]);

        $enseignant3 = Enseignant::create([
            'nom' => 'Carol White',
            'email' => 'carol@example.com',
            'password' => Hash::make('password123'),
            'departement_id' => null  // Enseignant simple
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
            'enseignant_id' => $enseignant1->id
        ]);

        $matiere2 = Matiere::create([
            'libelle' => 'Base de données',
            'code' => 'INFO302',
            'enseignant_id' => $enseignant1->id
        ]);

        // Création des horaires
        $horaire1 = Horaire::create([
            'jour' => 'LUNDI',
            'heure_debut' => '08:00',
            'heure_fin' => '10:00',
        ]);

        $horaire2 = Horaire::create([
            'jour' => 'MARDI',
            'heure_debut' => '10:00',
            'heure_fin' => '12:00',
        ]);

        // Création des associations entre les horaires et les classes et les matières
        HoraireClasseMatiere::create([
            'horaire_id' => $horaire1->id,
            'classe_id' => $classe1->id,
            'matiere_id' => $matiere1->id,
        ]);

        HoraireClasseMatiere::create([
            'horaire_id' => $horaire2->id,
            'classe_id' => $classe1->id,
            'matiere_id' => $matiere2->id,
        ]);

        // Création des étudiants
        $etudiant1 = Etudiant::create([
            'matricule' => 'ETU001',
            'nom' => 'Alice Johnson',
            'prenom' => 'Alice',
        ]);

        $etudiant2 = Etudiant::create([
            'matricule' => 'ETU002',
            'nom' => 'Bob Wilson',
            'prenom' => 'Bob',
        ]);

        // Association des étudiants aux classes
        $classe1->etudiants()->attach([$etudiant1->id, $etudiant2->id]);
    }
}