<?php

// namespace App\Exports;

// use App\Models\Estpresent;
// use App\Models\Horaire;
// use App\Models\Etudiant;
// use Maatwebsite\Excel\Concerns\FromCollection;
// use Maatwebsite\Excel\Concerns\WithHeadings;
// use Maatwebsite\Excel\Concerns\WithMapping;
// use Maatwebsite\Excel\Concerns\ShouldAutoSize;


// class PresencesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
// {
//     protected $matiereId;

//     public function __construct($matiereId)
//     {
//         $this->matiereId = $matiereId;
//     }

//     public function collection()
//     {
//         // Récupérer tous les horaires de la matière
//         $horaires = Horaire::where('matiere_id', $this->matiereId)->get();

//         // Récupérer tous les étudiants (non lié directement à la matière)
//         $etudiants = Etudiant::all();

//         // Récupérer toutes les présences liées à ces horaires
//         $horaireIds = $horaires->pluck('id');
//         $estPresents = Estpresent::whereIn('horaire_id', $horaireIds)->get();

//         // Extraire les dates uniques des présences
//         $dates = $estPresents->pluck('date')->unique()->sort();

//         // Organiser les données pour chaque étudiant
//         $data = [];
//         foreach ($etudiants as $etudiant) {
//             $row = [
//                 'Matricule' => $etudiant->matricule,
//                 'Nom et Prénoms' => $etudiant->nom . ' ' . $etudiant->prenom,
//             ];

//             // Ajouter une colonne pour chaque date avec une valeur par défaut "absent" (1)
//             foreach ($dates as $date) {
//                 $row[$date] = 1;
//             }

//             // Marquer les présences (0)
//             foreach ($estPresents->where('etudiant_id', $etudiant->id) as $presence) {
//                 $row[$presence->date] = 0;
//             }

//             // Calculer le total des absences
//             $row['Total'] = array_sum(array_slice($row, 2)); // Ignorer les 2 premières colonnes
//             $data[] = $row;
//         }

//         return collect($data);
//     }

//     public function headings(): array
//     {
//         // Récupérer les dates uniques des présences
//         $horaires = Horaire::where('matiere_id', $this->matiereId)->get();
//         $horaireIds = $horaires->pluck('id');
//         $dates = Estpresent::whereIn('horaire_id', $horaireIds)
//             ->pluck('date')
//             ->unique()
//             ->sort()
//             ->toArray();

//         // En-têtes pour le fichier Excel
//         return array_merge(
//             ['Matricule', 'Nom et Prénoms'],
//             $dates,
//             ['Total']
//         );
//     }

//     public function map($row): array
//     {
//         return $row;
//     }
// }
namespace App\Exports;

use App\Models\Estpresent;
use App\Models\Horaire;
use App\Models\Etudiant;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class PresencesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithCustomStartCell, WithEvents
{
    protected $matiereId;

    public function __construct($matiereId)
    {
        $this->matiereId = $matiereId;
    }

    public function collection()
    {
        $horaires = Horaire::where('matiere_id', $this->matiereId)->get();
        $etudiants = Etudiant::all();
        $horaireIds = $horaires->pluck('id');
        $estPresents = Estpresent::whereIn('horaire_id', $horaireIds)->get();
        $dates = $estPresents->pluck('date')->unique()->sort();

        $data = [];
        foreach ($etudiants as $etudiant) {
            $row = [
                'Matricule' => $etudiant->matricule,
                'Nom et Prénoms' => $etudiant->nom . ' ' . $etudiant->prenom,
            ];

            $presencesEtudiant = $estPresents->where('etudiant_id', $etudiant->id)
                                            ->pluck('horaire_id', 'date')
                                            ->toArray();

            foreach ($dates as $date) {
                $row[$date] = isset($presencesEtudiant[$date]) ? "0" : "1";
            }

            $absences = array_count_values(array_slice($row, 2))['1'] ?? 0;
            $row['Total'] = (string)$absences;

            $data[] = $row;
        }

        return collect($data);
    }

    public function headings(): array
    {
        $horaires = Horaire::where('matiere_id', $this->matiereId)->get();
        $horaireIds = $horaires->pluck('id');
        $dates = Estpresent::whereIn('horaire_id', $horaireIds)
            ->pluck('date')
            ->unique()
            ->sort()
            ->toArray();

        return array_merge(
            ['Matricule', 'Nom et Prénoms'],
            $dates,
            ['Total']
        );
    }

    public function map($row): array
    {
        return $row;
    }

    public function startCell(): string
    {
        return 'A2';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $worksheet = $event->sheet->getDelegate();
                
                // Obtenir la dernière colonne
                $lastColumn = $worksheet->getHighestColumn();
                
                // Ajouter et formater le titre
                $worksheet->mergeCells("A1:{$lastColumn}1");
                $worksheet->setCellValue('A1', 'Liste de Présences');
                $worksheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 16
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
                    ]
                ]);
                
                // Ajuster la hauteur de la première ligne pour le titre
                $worksheet->getRowDimension(1)->setRowHeight(30);

                // Formater la colonne Total en vert
                $columnRange = $lastColumn . '2:' . $lastColumn . $worksheet->getHighestRow();
                $worksheet->getStyle($columnRange)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => 'FFFFE0'
                        ]
                    ],
                    'font' => [
                        'bold' => true
                    ]
                ]);
            }
        ];
    }
}