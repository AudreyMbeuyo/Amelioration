"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClassesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/auth/login');
                return;
            }

            try {
                const currentUser = JSON.parse(userStr);
                setUser(currentUser);
                loadClasses();
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
                router.push('/auth/login');
                return;
            }
        }
    }, [router]);

    const loadClasses = async () => {
        setLoading(true);
        setError('');

        try {
            // TODO: Remplacer par un vrai appel API
            // const response = await fetch('http://agence-voyage.ddns.net:9026/api/classes', {
            //   headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json'
            //   }
            // });

            // Simulation temporaire en attendant la connexion backend
            setTimeout(() => {
                setClasses([
                    {
                        id: 1,
                        nom: '3GI',
                        departement: { nom: 'Informatique' },
                        niveau: '3ème année',
                        nombreEtudiants: 25,
                        chefClasse: 'Amadou Diallo'
                    },
                    {
                        id: 2,
                        nom: '4GI',
                        departement: { nom: 'Informatique' },
                        niveau: '4ème année',
                        nombreEtudiants: 28,
                        chefClasse: 'Fatou Fall'
                    },
                    {
                        id: 3,
                        nom: '5GI',
                        departement: { nom: 'Informatique' },
                        niveau: '5ème année',
                        nombreEtudiants: 22,
                        chefClasse: 'Moussa Sow'
                    }
                ]);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error('Erreur lors du chargement des classes:', error);
            setError('Impossible de charger les classes. Veuillez réessayer.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F26419]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1B396A]">Classes</h1>
                            <p className="mt-2 text-gray-600">
                                Gestion des classes et des niveaux d&apos; études
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Retour au dashboard
                        </Link>
                    </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liste des classes */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                            Liste des classes ({classes.length})
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Informations sur toutes les classes disponibles
                        </p>
                    </div>

                    {classes.length === 0 ? (
                        <div className="px-4 py-6 sm:px-6">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune classe</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Aucune classe n&apos; est disponible pour le moment.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {classes.map((classe) => (
                                <li key={classe.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 bg-[#F26419] rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">{classe.nom}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[#1B396A]">
                                                    {classe.nom} - {classe.niveau}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Département: {classe.departement.nom}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {classe.nombreEtudiants} étudiants • Chef de classe: {classe.chefClasse}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/admin/students?class=${classe.id}`}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#1B396A] bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Voir étudiants
                                            </Link>
                                            <Link
                                                href={`/presence?class=${classe.id}`}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                                            >
                                                Gérer présences
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Actions rapides */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/students"
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-[#F26419]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-[#1B396A]">Gérer les étudiants</h3>
                                <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer des étudiants</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/presence"
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-[#1B396A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-[#1B396A]">Prendre les présences</h3>
                                <p className="text-sm text-gray-500">Enregistrer les présences des étudiants</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/timetable"
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-[#1B396A]">Emploi du temps</h3>
                                <p className="text-sm text-gray-500">Consulter les horaires des classes</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}