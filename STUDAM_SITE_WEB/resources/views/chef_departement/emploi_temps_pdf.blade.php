<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Emploi du Temps - {{ $classe->nom }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .school-name {
            font-size: 24px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 10px;
        }
        .class-name {
            font-size: 20px;
            color: #2d3748;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #cbd5e0;
            padding: 8px;
            text-align: center;
            font-size: 12px;
        }
        th {
            background-color: #f8fafc;
            color: #1a365d;
            font-weight: bold;
        }
        .matiere {
            font-weight: bold;
            color: #2d3748;
        }
        .enseignant {
            font-size: 10px;
            color: #4a5568;
        }
        .code {
            font-size: 10px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-name">ÉCOLE NATIONALE SUPÉRIEURE POLYTECHNIQUE DE YAOUNDÉ</div>
        <div class="class-name">Emploi du Temps - {{ $classe->nom }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Horaire</th>
                @foreach(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as $jour)
                    <th>{{ $jour }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($heures as $heure)
                <tr>
                    <td>{{ $heure }}</td>
                    @foreach(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as $jour)
                        <td>
                            @php
                                list($heure_debut, $heure_fin) = explode(' - ', $heure);
                                $horaire = App\Models\Horaire::where('jour', $jour)
                                    ->where('heure_debut', $heure_debut)
                                    ->where('heure_fin', $heure_fin)
                                    ->first();
                                
                                $horaireClasseMatiere = $horaire ? App\Models\HoraireClasseMatiere::where('horaire_id', $horaire->id)
                                    ->where('classe_id', $classe->id)
                                    ->with(['matiere.enseignant'])
                                    ->first() : null;
                            @endphp
                            @if($horaireClasseMatiere && $horaireClasseMatiere->matiere)
                                <div class="matiere">{{ $horaireClasseMatiere->matiere->libelle }}</div>
                                <div class="code">{{ $horaireClasseMatiere->matiere->code }}</div>
                                @if($horaireClasseMatiere->matiere->enseignant)
                                    <div class="enseignant">{{ $horaireClasseMatiere->matiere->enseignant->nom }}</div>
                                @endif
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
