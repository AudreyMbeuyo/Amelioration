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
        // Super Admin
        // TODO
        // Chef de département
        $departement = Departement::where('nom', 'Génie Informatique')->first();
        
        $chef = Enseignant::create([
            'nom' => 'BOUETOU BOUETOU THOMAS',
            'email' => 'tbouetou@studam.com',
            'password' => Hash::make('password123'),
            'departement_id' => $departement->id
        ]);

        // Enseignants
        $enseignants = [
            ['nom' => 'TOUSSILE Wilson', 'email' => 'wtoussile@studam.com'],
            ['nom' => 'NASHIPU', 'email' => 'nashipu@studam.com'],
            ['nom' => 'FOUDA', 'email' => 'fouda@studam.com'],
            ['nom' => 'BATCHAKUI Bernabe', 'email' => 'bbatchakui@studam.com'],
            ['nom' => 'DJOTIO Thomas', 'email' => 'tdjotio@studam.com'],
            ['nom' => 'KOUAMOU Edouard', 'email' => 'ekouamou@studam.com'],
            ['nom' => 'CHANA Anne Marie', 'email' => 'achana@studam.com'],
            ['nom' => 'MBIANDA Joseph', 'email' => 'jmbianda@studam.com'],
            ['nom' => 'FIPPO Louis', 'email' => 'lfippo@studam.com'],
            ['nom' => 'NDONGSONG Estelle', 'email' => 'endongsong@studam.com']
        ];

        foreach ($enseignants as $enseignant) {
            Enseignant::create([
                'nom' => $enseignant['nom'],
                'email' => $enseignant['email'],
                'password' => Hash::make('password123'),
            ]);
        }
    }
}
