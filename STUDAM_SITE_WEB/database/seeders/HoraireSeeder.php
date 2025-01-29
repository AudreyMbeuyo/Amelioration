<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HoraireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Définir les horaires
        $horaires = [
            ['jour' => 'LUNDI', 'heure_debut' => '08:00:00', 'heure_fin' => '10:00:00'],
            ['jour' => 'LUNDI', 'heure_debut' => '10:15:00', 'heure_fin' => '12:15:00'],
            ['jour' => 'LUNDI', 'heure_debut' => '13:30:00', 'heure_fin' => '15:30:00'],
            ['jour' => 'LUNDI', 'heure_debut' => '15:45:00', 'heure_fin' => '17:45:00'],

            ['jour' => 'MARDI', 'heure_debut' => '08:00:00', 'heure_fin' => '10:00:00'],
            ['jour' => 'MARDI', 'heure_debut' => '10:15:00', 'heure_fin' => '12:15:00'],
            ['jour' => 'MARDI', 'heure_debut' => '13:30:00', 'heure_fin' => '15:30:00'],
            ['jour' => 'MARDI', 'heure_debut' => '15:45:00', 'heure_fin' => '17:45:00'],

            ['jour' => 'MERCREDI', 'heure_debut' => '08:00:00', 'heure_fin' => '10:00:00'],
            ['jour' => 'MERCREDI', 'heure_debut' => '10:15:00', 'heure_fin' => '12:15:00'],
            ['jour' => 'MERCREDI', 'heure_debut' => '13:30:00', 'heure_fin' => '15:30:00'],
            ['jour' => 'MERCREDI', 'heure_debut' => '15:45:00', 'heure_fin' => '17:45:00'],

            ['jour' => 'JEUDI', 'heure_debut' => '08:00:00', 'heure_fin' => '10:00:00'],
            ['jour' => 'JEUDI', 'heure_debut' => '10:15:00', 'heure_fin' => '12:15:00'],
            ['jour' => 'JEUDI', 'heure_debut' => '13:30:00', 'heure_fin' => '15:30:00'],
            ['jour' => 'JEUDI', 'heure_debut' => '15:45:00', 'heure_fin' => '17:45:00'],

            ['jour' => 'VENDREDI', 'heure_debut' => '08:00:00', 'heure_fin' => '10:00:00'],
            ['jour' => 'VENDREDI', 'heure_debut' => '10:15:00', 'heure_fin' => '12:15:00'],
            ['jour' => 'VENDREDI', 'heure_debut' => '13:30:00', 'heure_fin' => '15:30:00'],
            ['jour' => 'VENDREDI', 'heure_debut' => '15:45:00', 'heure_fin' => '17:45:00'],

        ];

        // Insérer les horaires dans la table
        DB::table('horaires')->insert($horaires);
    }
}