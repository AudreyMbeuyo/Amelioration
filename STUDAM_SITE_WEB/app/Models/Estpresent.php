<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Horaire;
use App\Models\Etudiant;
use App\Models\Enseignant;

class Estpresent extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'horaire_id', 'etudiant_id', 'enseignant_id'];
    public $timestamps = false; // Si la table n'a pas de colonnes `created_at` et `updated_at`

    public function horaire()
    {
        return $this->belongsTo(Horaire::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function enseignant(){
        return $this->belongsTo(Enseignant::class);
    }
}
