@extends('layouts.app')

@section('content')
<div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <!-- Messages de notification -->
        @if (session('success'))
            <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif

        @if (session('error'))
            <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        @endif

        <!-- Section Création de Département -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
            <div class="p-6 bg-white border-b border-gray-200">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Gestion des Départements</h2>
                    <button onclick="openDepartementModal()" class="bg-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Ajouter un Département
                    </button>
                </div>
            </div>
        </div>

        <!-- Section des chefs de département -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
            <div class="p-6 bg-white border-b border-gray-200">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Gestion des Chefs de Département</h2>
                    <button onclick="openChefModal()" class="bg-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Ajouter un Chef
                    </button>
                </div>

                <!-- Liste des départements et leurs chefs -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Département
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chef de Département
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($departements as $departement)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{{ $departement->nom }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        @if($departement->chefDepartement)
                                            {{ $departement->chefDepartement->nom }}
                                        @else
                                            <span class="text-gray-500">Aucun chef assigné</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    @if($departement->chefDepartement)
                                        <form action="{{ route('superadmin.delete_chef', $departement->chefDepartement->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900">Supprimer le chef</button>
                                        </form>
                                    @endif
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Section d'importation des étudiants -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div class="p-6 bg-white border-b border-gray-200">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Importation des Étudiants</h2>
                    <button onclick="openImportModal()" class="bg-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Importer des Étudiants
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal d'ajout de département -->
<div id="departementModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Ajouter un Département</h3>
            <form action="{{ route('superadmin.create_departement') }}" method="POST">
                @csrf
                <div class="mb-4">
                    <label for="nom" class="block text-sm font-medium text-gray-700">Nom du département</label>
                    <input type="text" name="nom" id="nom" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeDepartementModal()"
                            class="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300">
                        Annuler
                    </button>
                    <button type="submit"
                            class="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                        Créer
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal d'ajout de chef de département -->
<div id="chefModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Ajouter un Chef de Département</h3>
            <form action="{{ route('superadmin.create_chef') }}" method="POST">
                @csrf
                <div class="mb-4">
                    <label for="departement_id" class="block text-sm font-medium text-gray-700">Département</label>
                    <select name="departement_id" id="departement_id" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                        <option value="">Sélectionnez un département</option>
                        @foreach($departements as $departement)
                            @if(!$departement->chefDepartement)
                                <option value="{{ $departement->id }}">{{ $departement->nom }}</option>
                            @endif
                        @endforeach
                    </select>
                </div>

                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Nom du chef</label>
                    <input type="text" name="name" id="name" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                </div>

                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                </div>

                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input type="password" name="password" id="password" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeChefModal()"
                            class="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300">
                        Annuler
                    </button>
                    <button type="submit"
                            class="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                        Créer
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal d'importation des étudiants -->
<div id="importModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Importer des Étudiants</h3>
            <form action="{{ route('superadmin.import_etudiants') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="mb-4">
                    <label for="import_departement_id" class="block text-sm font-medium text-gray-700">Département</label>
                    <select name="departement_id" id="import_departement_id" required onchange="loadClasses(this.value)"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                        <option value="">Sélectionnez un département</option>
                        @foreach($departements as $departement)
                            <option value="{{ $departement->id }}">{{ $departement->nom }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-4">
                    <label for="classe_id" class="block text-sm font-medium text-gray-700">Classe</label>
                    <select name="classe_id" id="classe_id" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy focus:ring-navy">
                        <option value="">Sélectionnez d'abord un département</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="fichier" class="block text-sm font-medium text-gray-700">Fichier CSV</label>
                    <input type="file" name="fichier" id="fichier" required accept=".csv,.txt"
                           class="mt-1 block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-navy file:text-white
                                  hover:file:bg-blue-700">
                    <p class="mt-1 text-sm text-gray-500">
                        Le fichier CSV doit contenir les colonnes dans cet ordre : Matricule, Nom
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                        <a href="{{ route('superadmin.sample_csv') }}" class="text-navy hover:text-blue-700">
                            Télécharger un exemple de fichier CSV
                        </a>
                    </p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeImportModal()"
                            class="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300">
                        Annuler
                    </button>
                    <button type="submit"
                            class="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                        Importer
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    function downloadSampleCSV() {
        window.location.href = "{{ route('superadmin.sample_csv') }}";
    }

    function openImportModal() {
        document.getElementById('importModal').classList.remove('hidden');
    }

    function closeImportModal() {
        document.getElementById('importModal').classList.add('hidden');
    }

    function openDepartementModal() {
        document.getElementById('departementModal').classList.remove('hidden');
    }

    function closeDepartementModal() {
        document.getElementById('departementModal').classList.add('hidden');
    }

    function openChefModal() {
        document.getElementById('chefModal').classList.remove('hidden');
    }

    function closeChefModal() {
        document.getElementById('chefModal').classList.add('hidden');
    }

    function loadClasses(departementId) {
        if (!departementId) {
            document.getElementById('classe_id').innerHTML = '<option value="">Sélectionnez d\'abord un département</option>';
            return;
        }

        fetch(`/superadmin/classes/${departementId}`)
            .then(response => response.json())
            .then(classes => {
                let options = '<option value="">Sélectionnez une classe</option>';
                classes.forEach(classe => {
                    options += `<option value="${classe.id}">${classe.nom}</option>`;
                });
                document.getElementById('classe_id').innerHTML = options;
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors du chargement des classes');
            });
    }
</script>
@endpush
