<?php

namespace App\Http\Controllers;

use App\Exports\PresencesExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Horaire;

class PresenceController extends Controller
{
    public function export($horaireId)
    {
        $horaire = Horaire::findOrFail($horaireId);
        $fileName = 'presences_' . $horaire->nom . '.xlsx';

        return Excel::download(new PresencesExport($horaireId), $fileName);
    }
}