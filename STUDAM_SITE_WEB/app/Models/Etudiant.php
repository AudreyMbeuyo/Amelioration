<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Estpresent;

class Etudiant extends Model
{
    use HasFactory;

    protected $fillable = ['matricule', 'nom', 'prenom'];

    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'classe_id');
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class);
    }

    public function presences()
    {
        return $this->hasMany(Estpresent::class);
    }

    public static function findByMatricule($matricule){
        return self::where('matricule', $matricule)->first;
    }
}
