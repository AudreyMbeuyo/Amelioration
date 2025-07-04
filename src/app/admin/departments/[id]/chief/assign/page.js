"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AssignDepartmentChief() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.id;

    const [user, setUser] = useState(null);
    const [department, setDepartment] = useState(null);
    const [availableChiefs, setAvailableChiefs] = useState([]);
    const [selectedChief, setSelectedChief] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

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

            const mockAvailableChiefs = [
                {
                    id: 10,
                    nom: 'Dr. Fatou Diagne',
                    email: 'f.diagne@studam.edu',
                    phone: '+221 77 234 56 78',
                    specialite: 'Gestion Administrative',
                    experience: 'Docteur en Administration, 5 ans d\'expérience en gestion académique',
                    qualifications: [
                        'PhD en Administration des Entreprises',
                        'Certification en Management Éducatif',
                        'Expérience en gestion d\'équipes'
                    ],
                    departementActuel: null,
                    disponibilite: 'Immédiate',
                    evaluations: {
                        leadership: 4.8,
                        communication: 4.6,
                        organisation: 4.9
                    }
                },
                {
                    id: 11,
                    nom: 'Prof. Mamadou Ba',
                    email: 'm.ba@studam.edu',
                    phone: '+221 77 345 67 89',
                    specialite: 'Sciences Appliquées',
                    experience: 'Professeur titulaire, 8 ans d\'expérience en recherche et enseignement',
                    qualifications: [
                        'Professeur des Universités',
                        'Directeur de laboratoire',
                        '15+ publications internationales'
                    ],
                    departementActuel: null,
                    disponibilite: 'Immédiate',
                    evaluations: {
                        leadership: 4.5,
                        communication: 4.7,
                        organisation: 4.4
                    }
                },
                {
                    id: 12,
                    nom: 'Dr. Aïcha Ndiaye',
                    email: 'a.ndiaye@studam.edu',
                    phone: '+221 77 456 78 90',
                    specialite: 'Langues et Littérature',
                    experience: 'Chef de département Littérature, souhaite un transfert',
                    qualifications: [
                        'PhD en Linguistique Appliquée',
                        '4 ans d\'expérience comme chef',
                        'Expertise en gestion interculturelle'
                    ],
                    departementActuel: 'Littérature',
                    disponibilite: 'Après transition (1 mois)',
                    evaluations: {
                        leadership: 4.9,
                        communication: 4.8,
                        organisation: 4.7
                    }
                }
            ];

            setDepartment(mockDepartment);
            setAvailableChiefs(mockAvailableChiefs);

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setErrors({ general: 'Erreur lors du chargement des données' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedChief) {
            setErrors({ selectedChief: 'Veuillez sélectionner un chef de département' });
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const selectedChiefData = availableChiefs.find(chief => chief.id === parseInt(selectedChief));

            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccessMessage(
                `${selectedChiefData.nom} a été assigné avec succès comme chef du département ${department.nom}`
            );

            // Rediriger vers la gestion du chef après 3 secondes
            setTimeout(() => {
                router.push(`/admin/departments/${departmentId}/chief`);
            }, 3000);

        } catch (error) {
            console.error('Erreur lors de l\'assignation:', error);
            setErrors({ general: 'Erreur lors de l\'assignation du chef' });
        } finally {
            setSubmitting(false);
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
                                    <span className="ml-4 text-sm font-medium text-gray-500">Assigner chef</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Assigner un chef de département
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sélectionnez le nouveau chef pour le département {department?.nom}
                    </p>
                </div>
            </div>

            {/* Messages */}
            {errors.general && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{errors.general}</p>
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

            {/* Formulaire de sélection */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Candidats disponibles */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                            Candidats disponibles
                        </h3>

                        {errors.selectedChief && (
                            <div className="mb-4 text-sm text-red-600">{errors.selectedChief}</div>
                        )}

                        <div className="space-y-4">
                            {availableChiefs.map((chief) => (
                                <div key={chief.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedChief === chief.id.toString()
                                        ? 'border-[#F26419] bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="selectedChief"
                                            value={chief.id}
                                            checked={selectedChief === chief.id.toString()}
                                            onChange={(e) => setSelectedChief(e.target.value)}
                                            className="sr-only"
                                        />

                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#1B396A] to-[#2563eb] rounded-full flex items-center justify-center text-white font-bold">
                                                        {chief.nom.charAt(0)}
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                                                        {chief.nom}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {chief.specialite}
                                                    </p>

                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                            </svg>
                                                            {chief.email}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                            </svg>
                                                            Disponibilité: {chief.disponibilite}
                                                        </div>
                                                        {chief.departementActuel && (
                                                            <div className="flex items-center text-yellow-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                                                </svg>
                                                                Actuellement chef de: {chief.departementActuel}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-3">
                                                        <p className="text-sm text-gray-700 mb-2">
                                                            <strong>Expérience:</strong> {chief.experience}
                                                        </p>

                                                        <div className="mb-3">
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Qualifications:</p>
                                                            <ul className="text-xs text-gray-600 space-y-1">
                                                                {chief.qualifications.map((qual, index) => (
                                                                    <li key={index} className="flex items-center">
                                                                        <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                                        </svg>
                                                                        {qual}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 ml-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Évaluations</p>
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Leadership:</span>
                                                            <span className="font-medium">{chief.evaluations.leadership}/5</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Communication:</span>
                                                            <span className="font-medium">{chief.evaluations.communication}/5</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Organisation:</span>
                                                            <span className="font-medium">{chief.evaluations.organisation}/5</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    selectedChief === chief.id.toString()
                                                        ? 'border-[#F26419] bg-[#F26419]'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedChief === chief.id.toString() && (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {availableChiefs.length === 0 && (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun candidat disponible</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Il n&apos;y a actuellement aucun candidat qualifié disponible.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <Link
                        href={`/admin/departments/${departmentId}/chief`}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={!selectedChief || submitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Assignation en cours...
                            </>
                        ) : (
                            'Assigner comme chef'
                        )}
                    </button>
                </div>
            </form>

            {/* Informations importantes */}
            <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">
                    Informations importantes sur l&apos;assignation
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Processus d&apos;assignation</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Le nouveau chef sera notifié par email</li>
                            <li>• Les permissions seront accordées automatiquement</li>
                            <li>• Une période de transition peut être nécessaire</li>
                            <li>• L&apos;assignation prend effet immédiatement</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Responsabilités du chef</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Gestion des enseignants du département</li>
                            <li>• Supervision des emplois du temps</li>
                            <li>• Validation des programmes d&apos;études</li>
                            <li>• Rapport de performance départementale</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}