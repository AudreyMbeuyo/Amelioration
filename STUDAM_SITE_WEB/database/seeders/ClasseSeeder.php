<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;
use App\Models\Departement;

class ClasseSeeder extends Seeder
{
    public function run(): void
    {
        $departement = Departement::where('nom', 'Génie Informatique')->first();
        
        Classe::create([
            'nom' => '3GI',
            'departement_id' => $departement->id
        ]);

        Classe::create([
            'nom' => '4GI',
            'departement_id' => $departement->id
        ]);

        Classe::create([
            'nom' => '5GI',
            'departement_id' => $departement->id
        ]);
    }
}
