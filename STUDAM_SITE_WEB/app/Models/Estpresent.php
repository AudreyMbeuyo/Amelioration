<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Horaire;
use App\Models\Etudiant;

class Estpresent extends Model
{
    use HasFactory;

    protected $fillable = ['date'];

    public function horaire()
    {
        return $this->belongsTo(Horaire::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}
