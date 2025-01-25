@extends('layouts.app')

@section('content')

<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-navy">Emploi du Temps</h1>
            <nav class="flex" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <a href="{{ route('dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <a href="{{ route('chef_departement.index') }}" class="ml-1 text-sm font-medium text-gray-500 hover:text-orange md:ml-2">Emplois du temps</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ $classe->nom }}</span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>

        <div class="mt-4">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h2 class="text-lg leading-6 font-medium text-navy">
                        Emploi du Temps - {{ $classe->nom }}
                    </h2>
                    <button id="add-horaire-btn" class="bg-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Ajouter une horaire
                    </button>
                </div>

                <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Horaire
                                    </th>
                                    @foreach(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as $jour)
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {{ $jour }}
                                        </th>
                                    @endforeach
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                            @php
                                use App\Models\Horaire;
                                use App\Models\HoraireClasseMatiere;
                                
                                $heures = Horaire::distinct()->select('heure_debut', 'heure_fin')->get()->map(function ($horaire) {
                                    return $horaire->heure_debut . ' - ' . $horaire->heure_fin;
                                })->toArray();
                            @endphp

                                @foreach($heures as $heure)
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $heure }}
                                        </td>
                                        @foreach(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as $jour)
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                @php
                                                    list($heure_debut, $heure_fin) = explode(' - ', $heure);
                                                    $horaire = Horaire::where('jour', $jour)
                                                                    ->where('heure_debut', $heure_debut)
                                                                    ->where('heure_fin', $heure_fin)
                                                                    ->first();
                                                    
                                                    $horaireClasseMatiere = $horaire ? HoraireClasseMatiere::where('horaire_id', $horaire->id)
                                                                                                        ->where('classe_id', $classe->id)
                                                                                                        ->with(['matiere.enseignant'])
                                                                                                        ->first() : null;
                                                @endphp
                                                <div class="min-h-[40px] border border-dashed border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50 cell-click"
                                                     data-jour="{{ $jour }}"
                                                     data-heure="{{ $heure }}">
                                                     @if($horaireClasseMatiere && $horaireClasseMatiere->matiere)
                                                        <div class="flex flex-col">
                                                            <span class="font-medium text-navy">{{ $horaireClasseMatiere->matiere->libelle }}</span>
                                                            <span class="text-xs text-gray-500">{{ $horaireClasseMatiere->matiere->code }}</span>
                                                            @if($horaireClasseMatiere->matiere->enseignant)
                                                                <span class="text-xs text-gray-600">{{ $horaireClasseMatiere->matiere->enseignant->nom }}</span>
                                                            @endif
                                                        </div>
                                                    @else
                                                        <div class="text-center text-gray-400">
                                                            <span>Cliquez pour ajouter</span>
                                                        </div>
                                                    @endif
                                                </div>
                                            </td>
                                        @endforeach
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal pour ajouter une horaire -->
<div id="horaireModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute right-0 top-0 pr-4 pt-4">
                    <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none" onclick="closeHoraireModal()">
                        <span class="sr-only">Fermer</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                            Ajouter une horaire
                        </h3>
                        <form id="horaireForm" action="{{ route('horaire.store') }}" method="POST" class="space-y-4">
                            @csrf
                            <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <label for="heure_debut" class="block text-sm font-medium text-gray-700">Heure de début</label>
                                    <input type="time" id="heure_debut" name="heure_debut" required 
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange">
                                </div>
                                <div>
                                    <label for="heure_fin" class="block text-sm font-medium text-gray-700">Heure de fin</label>
                                    <input type="time" id="heure_fin" name="heure_fin" required 
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange">
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="submit"
                                        class="inline-flex w-full justify-center rounded-md bg-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange sm:ml-3 sm:w-auto">
                                    Ajouter
                                </button>
                                <button type="button" onclick="closeHoraireModal()"
                                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal pour ajouter/modifier une matière -->
<div id="matiereModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none" onclick="closeModal()">
                        <span class="sr-only">Fermer</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                            Ajouter une matière
                        </h3>

                        <form id="matiereForm" class="mt-4 space-y-4">
                            <input type="hidden" id="jour" name="jour">
                            <input type="hidden" id="heure" name="heure">
                            <input type="hidden" name="classe_id" value="{{ $classe->id }}">

                            <div>
                                <label for="nom_matiere" class="block text-sm font-medium text-gray-700">Nom de la matière</label>
                                <input type="text" name="nom_matiere" id="nom_matiere" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm">
                            </div>

                            <div>
                                <label for="code_matiere" class="block text-sm font-medium text-gray-700">Code de la matière</label>
                                <input type="text" name="code_matiere" id="code_matiere" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm">
                            </div>

                            <div>
                                <label for="enseignant_search" class="block text-sm font-medium text-gray-700">Rechercher un enseignant</label>
                                <input type="text" id="enseignant_search"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm"
                                       placeholder="Commencez à taper le nom...">
                                <div id="enseignants_list" class="mt-1 hidden">
                                    <ul class="max-h-32 overflow-auto rounded-md border border-gray-300 bg-white"></ul>
                                </div>
                            </div>

                            <div id="existing_enseignant" class="hidden">
                                <input type="hidden" name="enseignant_id" id="enseignant_id">
                                <div class="mt-2 p-2 bg-gray-50 rounded-md">
                                    <span class="text-sm font-medium text-gray-900" id="selected_enseignant_name"></span>
                                    <button type="button" onclick="clearEnseignant()" class="ml-2 text-sm text-red-600 hover:text-red-500">
                                        Changer
                                    </button>
                                </div>
                            </div>

                            <div id="nouveau_enseignant" class="space-y-4">
                                <div>
                                    <label for="nouveau_enseignant_nom" class="block text-sm font-medium text-gray-700">Nom de l'enseignant</label>
                                    <input type="text" name="nouveau_enseignant[nom]" id="nouveau_enseignant_nom"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm">
                                </div>

                                <div>
                                    <label for="nouveau_enseignant_email" class="block text-sm font-medium text-gray-700">Email de l'enseignant</label>
                                    <input type="email" name="nouveau_enseignant[email]" id="nouveau_enseignant_email"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm">
                                </div>

                                <div>
                                    <label for="nouveau_enseignant_password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <input type="password" name="nouveau_enseignant[password]" id="nouveau_enseignant_password"
                                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange sm:text-sm">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button type="submit" form="matiereForm"
                            class="inline-flex w-full justify-center rounded-md bg-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-dark sm:ml-3 sm:w-auto">
                        Enregistrer
                    </button>
                    <button type="button" onclick="closeModal()"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                        Annuler
                    </button>
                </div>

            

            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    $(document).ready(function() {
           // Bouton pour ouvrir le modal
           $('#add-horaire-btn').on('click', function () {
            $('#horaireModal').removeClass('hidden');
        });

        // Fonction pour fermer le modal
        window.closeHoraireModal = function() {
            $('#horaireModal').addClass('hidden');
        }

        // Soumission du formulaire d'ajout d'horaire
        $('#horaireForm').on('submit', function (e) {
            e.preventDefault();
            
            const formData = {
                heure_debut: $('#heure_debut').val(),
                heure_fin: $('#heure_fin').val(),
                _token: $('meta[name="csrf-token"]').attr('content')
            };

            $.ajax({
                url: $(this).attr('action'),
                method: 'POST',
                data: formData,
                success: function(response) {
                    // Fermer le modal
                    closeHoraireModal();
                    
                    // Rafraîchir la page ou mettre à jour le tableau
                    window.location.reload();
                },
                error: function(xhr) {
                    // Gérer les erreurs
                    alert('Une erreur est survenue. Veuillez réessayer.');
                    console.error(xhr);
                }
            });
        });
        
        // Configuration globale pour les requêtes AJAX
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Gestionnaire de soumission du formulaire
        $('#matiereForm').on('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Log des données envoyées
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Réinitialiser les messages d'erreur
            $('.error-message').remove();
            $('.border-red-500').removeClass('border-red-500');
            
            $.ajax({                   
                url: '{{ route('chef_departement.store_matiere_enseignant') }}',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('Succès:', response);
                    if (response.success) {
                        location.reload();
                    }
                },
                error: function(xhr) {
                    console.log('Erreur complète:', xhr);
                    console.log('Status:', xhr.status);
                    console.log('Response:', xhr.responseJSON);
                    
                    if (xhr.status === 422) {
                        const errors = xhr.responseJSON.errors;
                        console.log('Erreurs de validation:', errors);
                        
                        Object.keys(errors).forEach(function(field) {
                            const errorMessage = errors[field][0];
                            console.log('Champ:', field, 'Message:', errorMessage);
                            
                            if (field.includes('.')) {
                                // Pour les champs imbriqués comme nouveau_enseignant.nom
                                const parts = field.split('.');
                                const input = $(`[name="${parts[0]}[${parts[1]}]"]`);
                                input.addClass('border-red-500');
                                input.after(`<p class="text-red-500 text-xs mt-1 error-message">${errorMessage}</p>`);
                            } else {
                                // Pour les champs simples
                                const input = $(`[name="${field}"]`);
                                input.addClass('border-red-500');
                                input.after(`<p class="text-red-500 text-xs mt-1 error-message">${errorMessage}</p>`);
                            }
                        });
                    } else {
                        alert('Une erreur est survenue lors de la communication avec le serveur.');
                    }
                }
            });
            
            return false;
        });

        // Gestionnaire de clic pour ouvrir le modal
        $('.cell-click').on('click', function() {
            const jour = $(this).data('jour');
            const heure = $(this).data('heure');
            openModal(jour, heure);
        });
    });

    function openModal(jour, heure) {
        $('#jour').val(jour);
        $('#heure').val(heure);
        $('#matiereModal').removeClass('hidden');
    }

    function closeModal() {
        $('#matiereModal').addClass('hidden');
        $('#matiereForm')[0].reset();
        $('#existing_enseignant').addClass('hidden');
        $('#nouveau_enseignant').removeClass('hidden');
        $('#enseignants_list').addClass('hidden');
    }

    function clearEnseignant() {
        $('#existing_enseignant').addClass('hidden');
        $('#nouveau_enseignant').removeClass('hidden');
        $('#enseignant_id').val('');
    }

    let searchTimeout;
    $('#enseignant_search').on('input', function() {
        clearTimeout(searchTimeout);
        const search = $(this).val();
        
        if (search.length < 2) {
            $('#enseignants_list').addClass('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            $.get('{{ route('chef_departement.get_enseignants') }}', { search: search })
                .done(function(data) {
                    const list = $('#enseignants_list');
                    list.removeClass('hidden');
                    const ul = list.find('ul');
                    ul.empty();
                    
                    data.forEach(enseignant => {
                        const li = $('<li>')
                            .addClass('px-4 py-2 hover:bg-gray-100 cursor-pointer')
                            .text(enseignant.nom)
                            .on('click', () => selectEnseignant(enseignant));
                        ul.append(li);
                    });
                });
        }, 300);
    });

    function selectEnseignant(enseignant) {
        $('#enseignant_id').val(enseignant.id);
        $('#selected_enseignant_name').text(enseignant.nom);
        $('#existing_enseignant').removeClass('hidden');
        $('#nouveau_enseignant').addClass('hidden');
        $('#enseignants_list').addClass('hidden');
        $('#enseignant_search').val('');
    }
</script>
@endpush
