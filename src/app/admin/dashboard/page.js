"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDepartments: 0,
        totalTeachers: 0,
        totalStudents: 0,
        systemHealth: 'good'
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/auth/login');
                return;
            }

            try {
                const currentUser = JSON.parse(userStr);
                setUser(currentUser);

                // Simuler le chargement des données
                loadDashboardData();
            } catch (error) {
                console.error('Erreur:', error);
                router.push('/auth/login');
            }
        }
    }, [router]);

    const loadDashboardData = async () => {
        try {
            // Données simulées - à remplacer par des appels API réels
            setStats({
                totalUsers: 156,
                totalDepartments: 8,
                totalTeachers: 45,
                totalStudents: 1250,
                systemHealth: 'good'
            });

            setRecentActivity([
                {
                    id: 1,
                    type: 'user_created',
                    description: 'Nouvel enseignant créé : Dr. Aminata Fall',
                    timestamp: '2025-01-03 14:30',
                    icon: '👤'
                },
                {
                    id: 2,
                    type: 'department_updated',
                    description: 'Département Informatique mis à jour',
                    timestamp: '2025-01-03 12:15',
                    icon: '🏢'
                },
                {
                    id: 3,
                    type: 'system_backup',
                    description: 'Sauvegarde automatique effectuée',
                    timestamp: '2025-01-03 08:00',
                    icon: '💾'
                },
                {
                    id: 4,
                    type: 'user_login',
                    description: 'Connexion chef département: M. Diallo',
                    timestamp: '2025-01-03 07:45',
                    icon: '🔐'
                }
            ]);

            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Utilisateurs',
            value: stats.totalUsers,
            change: '+12%',
            changeType: 'increase',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            ),
            color: 'bg-blue-500',
            href: '/admin/users'
        },
        {
            title: 'Départements',
            value: stats.totalDepartments,
            change: '+2',
            changeType: 'increase',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
            ),
            color: 'bg-green-500',
            href: '/admin/departments'
        },
        {
            title: 'Enseignants',
            value: stats.totalTeachers,
            change: '+5%',
            changeType: 'increase',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
            ),
            color: 'bg-orange-500',
            href: '/admin/users/teachers'
        },
        {
            title: 'Étudiants',
            value: stats.totalStudents,
            change: '+8%',
            changeType: 'increase',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
            ),
            color: 'bg-purple-500',
            href: '/admin/users'
        }
    ];

    const quickActions = [
        {
            title: 'Créer un utilisateur',
            description: 'Ajouter un nouvel administrateur, chef de département ou enseignant',
            href: '/admin/users/create',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
            ),
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Nouveau département',
            description: 'Créer un nouveau département et assigner un chef',
            href: '/admin/departments/create',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
            ),
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Rapports système',
            description: 'Consulter les rapports et statistiques détaillées',
            href: '/admin/reports',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            ),
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'Paramètres système',
            description: 'Configurer les paramètres globaux de l\'application',
            href: '/admin/system',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            ),
            color: 'bg-gray-600 hover:bg-gray-700'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26419] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Dashboard Administrateur
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Bienvenue, {user?.name || user?.nom}. Voici un aperçu de votre système STUDAM.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Link
                        href="/admin/reports"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Voir tous les rapports
                    </Link>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Link key={index} href={stat.href}>
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`${stat.color} p-3 rounded-md text-white`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {stat.title}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {stat.value.toLocaleString()}
                                                </div>
                                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    <svg className={`self-center flex-shrink-0 h-4 w-4 ${
                                                        stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                                                    }`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d={
                                                            stat.changeType === 'increase'
                                                                ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                                : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                        } clipRule="evenodd"/>
                                                    </svg>
                                                    <span className="sr-only">
                            {stat.changeType === 'increase' ? 'Augmentation' : 'Diminution'}
                          </span>
                                                    {stat.change}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Actions rapides */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Actions rapides
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <div className={`${action.color} text-white p-4 rounded-lg hover:shadow-md transition-all cursor-pointer`}>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {action.icon}
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-medium">{action.title}</h4>
                                            <p className="text-xs text-white/80 mt-1">{action.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* État du système */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            État du système
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Serveur</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-green-600">En ligne</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Base de données</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-green-600">Connectée</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Capteurs biométriques</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-yellow-600">2/5 actifs</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                                <span className="text-sm text-gray-900">Il y a 2h</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/admin/system"
                                className="text-sm text-[#F26419] hover:text-orange-600 font-medium"
                            >
                                Voir détails système →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Activité récente */}
                <div className="lg:col-span-2 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Activité récente
                        </h3>
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {recentActivity.map((activity, index) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {index !== recentActivity.length - 1 && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                            {activity.icon}
                          </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {activity.timestamp}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/admin/system/logs"
                                className="text-sm text-[#F26419] hover:text-orange-600 font-medium"
                            >
                                Voir tous les logs →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphiques et métriques avancées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique d'activité */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Activité des 30 derniers jours
                        </h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">Graphique d&apos; activité</p>
                                <p className="text-xs text-gray-400">À implémenter avec Chart.js</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Départements les plus actifs */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Départements les plus actifs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Informatique', activity: 95, students: 320 },
                                { name: 'Mathématiques', activity: 87, students: 280 },
                                { name: 'Physique', activity: 82, students: 240 },
                                { name: 'Chimie', activity: 76, students: 190 },
                                { name: 'Biologie', activity: 71, students: 220 }
                            ].map((dept, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-900">{dept.name}</span>
                                            <span className="text-gray-500">{dept.activity}%</span>
                                        </div>
                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                            <span>{dept.students} étudiants</span>
                                        </div>
                                    </div>
                                    <div className="ml-4 w-24">
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-[#F26419] h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${dept.activity}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/admin/departments"
                                className="text-sm text-[#F26419] hover:text-orange-600 font-medium"
                            >
                                Gérer les départements →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}