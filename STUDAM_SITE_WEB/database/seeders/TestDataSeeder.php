<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;
use App\Models\Classe;
use App\Models\Matiere;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Créer un département
        $departement = Departement::create([
            'nom' => 'Informatique'
        ]);

        // Créer quelques classes
        $classe1 = Classe::create([
            'nom' => 'L3 Informatique',
            'departement_id' => $departement->id
        ]);

        $classe2 = Classe::create([
            'nom' => 'M1 Informatique',
            'departement_id' => $departement->id
        ]);

        // Créer quelques matières
        $matieres = [
            'Programmation Web',
            'Base de données',
            'Algorithmes',
            'Intelligence Artificielle',
            'Réseaux'
        ];

        foreach ($matieres as $nom) {
            $matiere = Matiere::create(['nom' => $nom]);
            // Associer les matières aux classes
            $classe1->matieres()->attach($matiere->id);
            $classe2->matieres()->attach($matiere->id);
        }
    }
}
