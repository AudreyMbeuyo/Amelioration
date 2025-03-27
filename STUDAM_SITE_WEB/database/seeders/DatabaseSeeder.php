<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DepartementSeeder::class,
            EnseignantSeeder::class,
            ClasseSeeder::class,
            EtudiantSeeder::class,
            HoraireSeeder::class,
            MatiereSeeder::class,
            // HoraireMatiereSeeder::class,
            MatiereClasseSeeder::class
        ]);
    }
}