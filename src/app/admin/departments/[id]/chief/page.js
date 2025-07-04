"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ManageDepartmentChief() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.id;

    const [user, setUser] = useState(null);
    const [department, setDepartment] = useState(null);
    const [currentChief, setCurrentChief] = useState(null);
    const [availableChiefs, setAvailableChiefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedChief, setSelectedChief] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/auth/login');
                return;
            }

            try {
                const currentUser = JSON.parse(userStr);
                if (!['admin', 'super_admin', 'ADMIN'].includes(currentUser.role)) {
                    router.push('/dashboard');
                    return;
                }

                setUser(currentUser);
                loadData();
            } catch (error) {
                console.error('Erreur:', error);
                router.push('/auth/login');
            }
        }
    }, [router, departmentId]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Données simulées - à remplacer par appels API réels
            const mockDepartment = {
                id: parseInt(departmentId),
                nom: 'Informatique',
                code: 'INFO',
                description: 'Département des Sciences Informatiques'
            };

            const mockCurrentChief = {
                id: 5,
                nom: 'Dr. Cheikh Anta Diop',
                email: 'chef.info@studam.edu',
                phone: '+221 77 123 45 67',
                specialite: 'Intelligence Artificielle',
                dateAssignation: '2023-09-01',
                experienceChef: '2 ans',
                totalEnseignants: 12,
                performance: {
                    evaluationGlobale: 'Excellente',
                    tauxPresence: 92,
                    satisfactionEtudiants: 4.5,
                    projetsMenes: 8
                }
            };

            const mockAvailableChiefs = [
                {
                    id: 10,
                    nom: 'Dr. Fatou Diagne',
                    email: 'f.diagne@studam.edu',
                    phone: '+221 77 234 56 78',
                    specialite: 'Gestion Administrative',
                    experience: '5 ans en administration',
                    departementActuel: null
                },
                {
                    id: 11,
                    nom: 'Prof. Mamadou Ba',
                    email: 'm.ba@studam.edu',
                    phone: '+221 77 345 67 89',
                    specialite: 'Sciences Appliquées',
                    experience: '3 ans en recherche',
                    departementActuel: null
                },
                {
                    id: 12,
                    nom: 'Dr. Aïcha Ndiaye',
                    email: 'a.ndiaye@studam.edu',
                    phone: '+221 77 456 78 90',
                    specialite: 'Langues et Littérature',
                    experience: '4 ans en enseignement',
                    departementActuel: 'Littérature' // A un département mais peut être transféré
                }
            ];

            setDepartment(mockDepartment);
            setCurrentChief(mockCurrentChief);
            setAvailableChiefs(mockAvailableChiefs);

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignChief = async () => {
        if (!selectedChief) return;

        setActionLoading(true);
        setError('');

        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newChief = availableChiefs.find(chief => chief.id === parseInt(selectedChief));

            setCurrentChief({
                ...newChief,
                dateAssignation: new Date().toISOString().split('T')[0],
                experienceChef: 'Nouveau',
                totalEnseignants: currentChief?.totalEnseignants || 0,
                performance: {
                    evaluationGlobale: 'En cours',
                    tauxPresence: 0,
                    satisfactionEtudiants: 0,
                    projetsMenes: 0
                }
            });

            setSuccessMessage(`${newChief.nom} a été assigné comme chef du département ${department.nom}`);
            setShowAssignModal(false);
            setSelectedChief('');

            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (error) {
            console.error('Erreur lors de l\'assignation:', error);
            setError('Erreur lors de l\'assignation du chef');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveChief = async () => {
        setActionLoading(true);
        setError('');

        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const removedChiefName = currentChief.nom;
            setCurrentChief(null);
            setSuccessMessage(`${removedChiefName} a été retiré de son poste de chef de département`);
            setShowRemoveModal(false);

            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Erreur lors de la suppression du chef');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26419] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-500">
                                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                    </svg>
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <Link href="/admin/departments" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        Départements
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <Link href={`/admin/departments/${departmentId}`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        {department?.nom}
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="ml-4 text-sm font-medium text-gray-500">Gérer le chef</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Gestion du chef de département
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Département {department?.nom} ({department?.code})
                    </p>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chef actuel */}
            {currentChief ? (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Chef actuel du département
                            </h3>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowAssignModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Changer de chef
                                </button>
                                <button
                                    onClick={() => setShowRemoveModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    Retirer du poste
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Informations personnelles */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#1B396A] to-[#2563eb] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {currentChief.nom.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-medium text-gray-900">{currentChief.nom}</h4>
                                        <p className="text-sm text-gray-500">{currentChief.specialite}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        {currentChief.email}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                        {currentChief.phone}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                                        </svg>
                                        Chef depuis le {new Date(currentChief.dateAssignation).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </div>

                            {/* Statistiques de gestion */}
                            <div className="lg:col-span-2">
                                <h5 className="text-sm font-medium text-gray-900 mb-4">Performance de gestion</h5>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{currentChief.totalEnseignants}</div>
                                        <div className="text-sm text-gray-600">Enseignants supervisés</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{currentChief.performance.tauxPresence}%</div>
                                        <div className="text-sm text-gray-600">Taux de présence</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{currentChief.performance.satisfactionEtudiants}/5</div>
                                        <div className="text-sm text-gray-600">Satisfaction étudiants</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{currentChief.performance.projetsMenes}</div>
                                        <div className="text-sm text-gray-600">Projets menés</div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span className="text-sm font-medium text-green-800">
                      Évaluation globale : {currentChief.performance.evaluationGlobale}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Aucun chef assigné */
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun chef assigné</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Ce département n&apos; a actuellement aucun chef assigné.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-orange-600"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                Assigner un chef
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Candidats disponibles */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Candidats disponibles
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availableChiefs.map((chief) => (
                            <div key={chief.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#F26419] to-[#FF7A47] rounded-full flex items-center justify-center text-white font-medium">
                                        {chief.nom.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-gray-900">{chief.nom}</h4>
                                        <p className="text-xs text-gray-500">{chief.specialite}</p>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs text-gray-600 mb-3">
                                    <p>{chief.email}</p>
                                    <p>{chief.experience}</p>
                                    {chief.departementActuel && (
                                        <p className="text-yellow-600">
                                            Actuellement: {chief.departementActuel}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedChief(chief.id.toString());
                                        setShowAssignModal(true);
                                    }}
                                    className="w-full text-center px-3 py-2 border border-[#F26419] text-[#F26419] rounded-md text-sm font-medium hover:bg-orange-50 transition-colors"
                                >
                                    Sélectionner
                                </button>
                            </div>
                        ))}
                    </div>

                    {availableChiefs.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                            Aucun candidat disponible pour le moment.
                        </p>
                    )}
                </div>
            </div>

            {/* Modal d'assignation */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {currentChief ? 'Changer de chef' : 'Assigner un chef'}
                            </h3>

                            {!selectedChief ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sélectionner un nouveau chef
                                    </label>
                                    <select
                                        value={selectedChief}
                                        onChange={(e) => setSelectedChief(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F26419] focus:border-[#F26419] sm:text-sm"
                                    >
                                        <option value="">Sélectionner un chef</option>
                                        {availableChiefs.map((chief) => (
                                            <option key={chief.id} value={chief.id}>
                                                {chief.nom} - {chief.specialite}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        Vous êtes sur le point d&apos; assigner{' '}
                                        <span className="font-medium">
                      {availableChiefs.find(c => c.id === parseInt(selectedChief))?.nom}
                    </span>
                                        {' '}comme chef du département {department?.nom}.
                                    </p>

                                    {currentChief && (
                                        <p className="text-sm text-yellow-600 mt-2">
                                            Cela remplacera {currentChief.nom} qui sera automatiquement notifié.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedChief('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    disabled={actionLoading}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAssignChief}
                                    disabled={!selectedChief || actionLoading}
                                    className="px-4 py-2 bg-[#F26419] text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Assignation...
                                        </>
                                    ) : (
                                        'Assigner'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de suppression */}
            {showRemoveModal && currentChief && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-2">
                                Retirer le chef de département
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Êtes-vous sûr de vouloir retirer{' '}
                                    <span className="font-medium">{currentChief.nom}</span>
                                    {' '}de son poste de chef du département {department?.nom} ?
                                </p>
                                <p className="text-sm text-red-600 mt-2">
                                    Le département n&apos;aura plus de chef jusqu&apos;à ce qu&apos;un nouveau soit assigné.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleRemoveChief}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <svg className="animate-spin h-4 w-4 text-white mx-auto" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Retirer'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowRemoveModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    disabled={actionLoading}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}