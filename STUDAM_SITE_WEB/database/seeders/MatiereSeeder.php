<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;
use App\Models\Enseignant;
use App\Models\Departement;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $departement = Departement::where('nom', 'Génie Informatique')->first();

        $matieres = [
            ['libelle' => 'Analyse de données', 'code' => 'AD401', 'email' => 'wtoussile@studam.com'],
            ['libelle' => 'Anglais', 'code' => 'ANG401', 'email' => 'nashipu@studam.com'],
            ['libelle' => 'Management 3', 'code' => 'MAN401', 'email' => 'fouda@studam.com'],
            ['libelle' => 'Interaction Homme Machine', 'code' => 'IHM401', 'email' => 'bbatchakui@studam.com'],
            ['libelle' => 'Administration des réseaux', 'code' => 'RES401', 'email' => 'tdjotio@studam.com'],
            ['libelle' => 'Grammaire et langages', 'code' => 'GL401', 'email' => 'ekouamou@studam.com'],
            ['libelle' => 'Electronique', 'code' => 'EL401', 'email' => 'achana@studam.com'],
            ['libelle' => 'Conduite de projets', 'code' => 'PRJ401', 'email' => 'jmbianda@studam.com'],
            ['libelle' => 'Machine Learning', 'code' => 'ML401', 'email' => 'lfippo@studam.com'],
            ['libelle' => 'Programmation Web', 'code' => 'WEB401', 'email' => 'endongsong@studam.com']
        ];

        foreach ($matieres as $matiere) {
            $enseignant = Enseignant::where('email', $matiere['email'])->first();
            
            if ($enseignant) {
                Matiere::create([
                    'libelle' => $matiere['libelle'],
                    'code' => $matiere['code'],
                    'enseignant_id' => $enseignant->id
                ]);
            }
        }
    }
}
