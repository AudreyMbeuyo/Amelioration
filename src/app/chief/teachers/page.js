"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeachersPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        subject: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Configuration backend
    const BACKEND_URL = 'http://agence-voyage.ddns.net:9026/api';

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté et a les droits d'admin
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                console.log('[TEACHERS] Utilisateur non connecté, redirection...');
                router.push('/auth/login');
                return;
            }

            try {
                const currentUser = JSON.parse(userStr);
                console.log('👤 [TEACHERS] Utilisateur connecté:', currentUser);
                setUser(currentUser);

                // Vérifier si l'utilisateur a les droits d'admin
                if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin' && currentUser.role !== 'chef_departement') {
                    console.log('[TEACHERS] Droits insuffisants, redirection vers dashboard');
                    router.push('/dashboard');
                    return;
                }

                // Charger les données depuis le backend
                loadAllData();
            } catch (error) {
                console.error('[TEACHERS] Erreur parsing utilisateur:', error);
                router.push('/auth/login');
                return;
            }
        }
    }, [router]);

    // Fonction principale pour charger toutes les données
    const loadAllData = async () => {
        console.log('[TEACHERS] Chargement de toutes les données...');
        setLoading(true);
        setError('');

        try {
            // Charger en parallèle pour optimiser les performances
            await Promise.all([
                loadTeachers(),
                loadDepartments(),
                loadSubjects()
            ]);
        } catch (error) {
            console.error('[TEACHERS] Erreur chargement données:', error);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Charger les enseignants depuis le backend
    const loadTeachers = async () => {
        console.log('🔄 [TEACHERS] Chargement enseignants depuis le backend...');

        try {
            const token = localStorage.getItem('authToken');
            console.log('[TEACHERS] Token utilisé:', token ? 'Présent' : 'Absent');

            const response = await fetch(`${BACKEND_URL}/teachers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('📡 [TEACHERS] Réponse du serveur:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('[TEACHERS] Token expiré, redirection vers login');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    router.push('/auth/login');
                    return;
                }
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ [TEACHERS] Données enseignants reçues:', data);

            // Adapter selon la structure de réponse du backend
            const teachersData = data.teachers || data.data || data || [];
            setTeachers(Array.isArray(teachersData) ? teachersData : []);

            console.log(`✅ [TEACHERS] ${teachersData.length} enseignants chargés`);

        } catch (error) {
            console.error('❌ [TEACHERS] Erreur chargement enseignants:', error);

            // En cas d'erreur, utiliser des données vides mais afficher un message informatif
            setTeachers([]);
            setError(`Impossible de charger les enseignants: ${error.message}`);

            // Optionnel: proposer de réessayer
            setTimeout(() => {
                if (window.confirm('Erreur de chargement. Voulez-vous réessayer?')) {
                    loadTeachers();
                }
            }, 2000);
        }
    };

    // Charger les départements depuis le backend
    const loadDepartments = async () => {
        console.log('[TEACHERS] Chargement départements...');

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_URL}/departments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const deptData = data.departments || data.data || data || [];
                setDepartments(Array.isArray(deptData) ? deptData : []);
                console.log(`[TEACHERS] ${deptData.length} départements chargés`);
            } else {
                console.log('[TEACHERS] Départements non disponibles');
                setDepartments([]);
            }
        } catch (error) {
            console.error('[TEACHERS] Erreur chargement départements:', error);
            setDepartments([]);
        }
    };

    // Charger les matières depuis le backend
    const loadSubjects = async () => {
        console.log('[TEACHERS] Chargement matières...');

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_URL}/subjects`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const subjectsData = data.subjects || data.data || data || [];
                setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
                console.log(`[TEACHERS] ${subjectsData.length} matières chargées`);
            } else {
                console.log('[TEACHERS] Matières non disponibles');
                setSubjects([]);
            }
        } catch (error) {
            console.error('[TEACHERS] Erreur chargement matières:', error);
            setSubjects([]);
        }
    };

    // Filtrer les enseignants selon les critères
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = !filters.search ||
            teacher.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(filters.search.toLowerCase());

        const matchesDepartment = !filters.department ||
            teacher.departement?.id?.toString() === filters.department;

        const matchesSubject = !filters.subject ||
            teacher.matieres?.some(matiere => matiere.id?.toString() === filters.subject);

        return matchesSearch && matchesDepartment && matchesSubject;
    });

    // Gérer la création/modification d'un enseignant
    const handleSaveTeacher = async (teacherData) => {
        console.log('[TEACHERS] Sauvegarde enseignant:', teacherData);

        try {
            const token = localStorage.getItem('authToken');
            const isEdit = !!selectedTeacher;
            const url = isEdit
                ? `${BACKEND_URL}/teachers/${selectedTeacher.id}`
                : `${BACKEND_URL}/teachers`;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teacherData)
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [TEACHERS] Enseignant sauvegardé:', result);

            setSuccessMessage(isEdit ? 'Enseignant modifié avec succès' : 'Enseignant créé avec succès');
            setShowModal(false);
            setSelectedTeacher(null);

            // Recharger la liste
            loadTeachers();

        } catch (error) {
            console.error('[TEACHERS] Erreur sauvegarde:', error);
            setError(`Erreur lors de la sauvegarde: ${error.message}`);
        }
    };

    // Version simplifiée pour test (évite l'erreur ESLint)
    const handleSaveTeacherDemo = () => {
        console.log('💾 [TEACHERS] Demo sauvegarde - à remplacer par le vrai formulaire');
        // Pour l'instant, on simule une sauvegarde
        const demoData = {
            nom: 'Test Enseignant',
            email: 'test@studam.edu',
            role: 'teacher'
        };
        handleSaveTeacher(demoData);
    };

    // Gérer la suppression d'un enseignant
    const handleDeleteTeacher = async (teacherId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant?')) {
            return;
        }

        console.log('🗑️ [TEACHERS] Suppression enseignant:', teacherId);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_URL}/teachers/${teacherId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }

            console.log('✅ [TEACHERS] Enseignant supprimé');
            setSuccessMessage('Enseignant supprimé avec succès');

            // Recharger la liste
            loadTeachers();

        } catch (error) {
            console.error('[TEACHERS] Erreur suppression:', error);
            setError(`Erreur lors de la suppression: ${error.message}`);
        }
    };

    // Composant de filtres
    const TeachersFilter = () => (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">Filtres</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rechercher
                    </label>
                    <input
                        type="text"
                        placeholder="Nom ou email..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Département
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={filters.department}
                        onChange={(e) => setFilters({...filters, department: e.target.value})}
                    >
                        <option value="">Tous les départements</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Matière
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={filters.subject}
                        onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    >
                        <option value="">Toutes les matières</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.libelle}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    // Composant de liste des enseignants
    const TeachersList = () => (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {filteredTeachers.length === 0 ? (
                    <li className="px-6 py-8 text-center text-gray-500">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2">Chargement des enseignants...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-600">
                                <p>{error}</p>
                                <button
                                    onClick={loadTeachers}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Réessayer
                                </button>
                            </div>
                        ) : (
                            'Aucun enseignant trouvé'
                        )}
                    </li>
                ) : (
                    filteredTeachers.map((teacher) => (
                        <li key={teacher.id}>
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                                {teacher.nom?.charAt(0)?.toUpperCase() || 'T'}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {teacher.nom || 'Nom non renseigné'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {teacher.email || 'Email non renseigné'}
                                            </div>
                                            {teacher.departement && (
                                                <div className="text-xs text-blue-600">
                                                    {teacher.departement.nom}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTeacher(teacher);
                                            setShowModal(true);
                                        }}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeacher(teacher.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );

    // Composant modal simplifié (à remplacer par le vrai composant)
    const TeacherModal = () => (
        showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="text-lg font-medium mb-4">
                        {selectedTeacher ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Cette fonctionnalité sera implémentée avec le composant TeacherModal complet.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setSelectedTeacher(null);
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSaveTeacherDemo}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Test Sauvegarde
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    if (loading && teachers.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gestion des Enseignants
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                ← Retour
                            </Link>
                            <button
                                onClick={() => {
                                    setSelectedTeacher(null);
                                    setShowModal(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                                + Nouvel Enseignant
                            </button>
                            <button
                                onClick={loadAllData}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                                🔄 Actualiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="text-green-800">{successMessage}</div>
                        <button
                            onClick={() => setSuccessMessage('')}
                            className="mt-2 text-green-600 text-sm underline"
                        >
                            Fermer
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="text-red-800">{error}</div>
                        <button
                            onClick={() => setError('')}
                            className="mt-2 text-red-600 text-sm underline"
                        >
                            Fermer
                        </button>
                    </div>
                )}

                {/* Filtres */}
                <TeachersFilter />

                {/* Liste des enseignants */}
                <TeachersList />

                {/* Modal */}
                <TeacherModal />

                {/* Informations de debug (à retirer en production) */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="text-yellow-800 font-medium">🔧 Informations de debug</h4>
                    <div className="text-yellow-700 text-sm mt-2 space-y-1">
                        <p><strong>Backend URL:</strong> {BACKEND_URL}</p>
                        <p><strong>Token présent:</strong> {localStorage.getItem('authToken') ? 'Oui' : 'Non'}</p>
                        <p><strong>Enseignants chargés:</strong> {teachers.length}</p>
                        <p><strong>Départements:</strong> {departments.length}</p>
                        <p><strong>Matières:</strong> {subjects.length}</p>
                        <p><strong>Filtres actifs:</strong> {Object.values(filters).filter(Boolean).length}</p>
                    </div>
                    <button
                        onClick={() => console.log('[DEBUG] État complet:', { teachers, departments, subjects, filters, user })}
                        className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-sm"
                    >
                        Log état dans console
                    </button>
                </div>
            </div>
        </div>
    );
}