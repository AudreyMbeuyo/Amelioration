<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Matiere;
use App\Models\Estpresent;

class Horaire extends Model
{
    use HasFactory;

    protected $fillable = ['jour', 'heure_debut', 'heure_fin'];

    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }

    public function estpresents()
    {
        return $this->hasMany(Estpresent::class);
    }
}
