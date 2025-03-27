<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Enseignant;
use App\Models\Departement;
use Illuminate\Support\Facades\Hash;

class EnseignantSeeder extends Seeder
{
    public function run(): void
    {
        // Chef de département
        $departement = Departement::where('nom', 'Génie Informatique')->first();
        
        $chef = Enseignant::create([
            'nom' => 'BOUETOU BOUETOU THOMAS',
            'email' => 'tbouetou@studam.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departement->id,
            'matricule' => 'ENS001'
        ]);

        // Enseignants
        $enseignants = [
            ['nom' => 'TOUSSILE Wilson', 'email' => 'wtoussile@studam.com', 'matricule' => 'ENS002'],
            ['nom' => 'NASHIPU', 'email' => 'nashipu@studam.com', 'matricule' => 'ENS003'],
            ['nom' => 'FOUDA', 'email' => 'fouda@studam.com', 'matricule' => 'ENS004'],
            ['nom' => 'BATCHAKUI Bernabe', 'email' => 'bbatchakui@studam.com', 'matricule' => 'ENS005'],
            ['nom' => 'DJOTIO Thomas', 'email' => 'tdjotio@studam.com', 'matricule' => 'ENS006'],
            ['nom' => 'KOUAMOU Edouard', 'email' => 'ekouamou@studam.com', 'matricule' => 'ENS007'],
            ['nom' => 'CHANA Anne Marie', 'email' => 'achana@studam.com', 'matricule' => 'ENS008'],
            ['nom' => 'MBIANDA Joseph', 'email' => 'jmbianda@studam.com', 'matricule' => 'ENS009'],
            ['nom' => 'FIPPO Louis', 'email' => 'lfippo@studam.com', 'matricule' => 'ENS010'],
            ['nom' => 'NDONGSONG Estelle', 'email' => 'endongsong@studam.com', 'matricule' => 'ENS011']
        ];

        foreach ($enseignants as $enseignant) {
            Enseignant::create([
                'nom' => $enseignant['nom'],
                'email' => $enseignant['email'],
                'password' => Hash::make('password123'),
                'matricule' => $enseignant['matricule']
            ]);
        }
    }
}
