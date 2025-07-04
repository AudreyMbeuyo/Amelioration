"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateUser() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        phoneNumber: '',
        password: '',
        password_confirmation: '',
        role: 'teacher',
        departmentId: '',
        status: 'active'
    });
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
                loadDepartments();
            } catch (error) {
                console.error('Erreur:', error);
                router.push('/auth/login');
            }
        }
    }, [router]);

    const loadDepartments = async () => {
        try {
            // Données simulées - à remplacer par appel API réel
            const mockDepartments = [
                { id: 1, nom: 'Informatique', code: 'INFO' },
                { id: 2, nom: 'Mathématiques', code: 'MATH' },
                { id: 3, nom: 'Physique', code: 'PHYS' },
                { id: 4, nom: 'Chimie', code: 'CHIM' }
            ];
            setDepartments(mockDepartments);
        } catch (error) {
            console.error('Erreur lors du chargement des départements:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Génération automatique du username
        if (name === 'name' || name === 'email') {
            const nameValue = name === 'name' ? value : formData.name;
            const emailValue = name === 'email' ? value : formData.email;

            if (nameValue && emailValue) {
                const autoUsername = generateUsername(nameValue, emailValue);
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    username: autoUsername
                }));
            }
        }

        // Effacer l'erreur correspondante
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const generateUsername = (name, email) => {
        const namePart = name.trim().toLowerCase().replace(/\s+/g, '');
        const emailPart = email.split('@')[0] || '';
        return (namePart.slice(0, 6) + emailPart.slice(0, 4)).replace(/[^a-z0-9]/g, '');
    };

    const validateForm = () => {
        const newErrors = {};

        // Validation nom
        if (!formData.name.trim()) {
            newErrors.name = "Le nom complet est requis";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères";
        }

        // Validation email
        if (!formData.email.trim()) {
            newErrors.email = "L'adresse email est requise";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'adresse email n'est pas valide";
        }

        // Validation username
        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        } else if (formData.username.length < 3) {
            newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et tirets bas";
        }

        // Validation téléphone
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Le numéro de téléphone est requis";
        } else if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = "Le numéro de téléphone n'est pas valide";
        }

        // Validation mot de passe
        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
        }

        // Validation confirmation mot de passe
        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "La confirmation du mot de passe est requise";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
        }

        // Validation rôle
        if (!formData.role) {
            newErrors.role = "Le rôle est requis";
        }

        // Validation département pour les enseignants et chefs de département
        if ((formData.role === 'teacher' || formData.role === 'chef_departement') && !formData.departmentId) {
            newErrors.departmentId = "Le département est requis pour ce rôle";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation côté client
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Préparer les données pour l'API
            const apiData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                username: formData.username.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                password: formData.password,
                role: formData.role,
                ...(formData.departmentId && { departmentId: parseInt(formData.departmentId) }),
                status: formData.status
            };

            console.log('Données à envoyer:', apiData);

            // Simulation d'appel API - à remplacer par un vrai appel
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccessMessage(`Utilisateur "${formData.name}" créé avec succès !`);

            // Rediriger vers la liste des utilisateurs après 2 secondes
            setTimeout(() => {
                router.push('/admin/users');
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de la création:', error);
            setErrors({ general: error.message || 'Erreur lors de la création de l\'utilisateur' });
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'teacher', label: 'Enseignant', description: 'Peut gérer ses cours et prendre les présences' },
        { value: 'chef_departement', label: 'Chef de Département', description: 'Peut gérer un département et ses enseignants' },
        { value: 'admin', label: 'Administrateur', description: 'Accès complet au système' }
    ];

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
                                    <Link href="/admin/users" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        Utilisateurs
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="ml-4 text-sm font-medium text-gray-500">Créer</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Créer un nouvel utilisateur
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Ajoutez un nouvel administrateur, chef de département ou enseignant au système.
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

            {/* Formulaire */}
            <div className="bg-white shadow rounded-lg">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                            {/* Informations personnelles */}
                            <div className="sm:col-span-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Informations personnelles
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Renseignez les informations de base de l&apos; utilisateur.
                                </p>
                            </div>

                            {/* Nom complet */}
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom complet *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.name ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Ex: Dr. Aminata Sow Fall"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Adresse email *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.email ? 'border-red-300' : ''
                                        }`}
                                        placeholder="aminata.sow@studam.edu"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Nom d'utilisateur */}
                            <div className="sm:col-span-3">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Nom d&apos;utilisateur *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.username ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Généré automatiquement"
                                    />
                                    {errors.username && (
                                        <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Le nom d&apos;utilisateur est généré automatiquement mais peut être modifié.
                                    </p>
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="sm:col-span-3">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Numéro de téléphone *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.phoneNumber ? 'border-red-300' : ''
                                        }`}
                                        placeholder="+221 77 123 45 67"
                                    />
                                    {errors.phoneNumber && (
                                        <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="sm:col-span-6">
                                <hr className="my-4"/>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Accès et permissions
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Définissez le rôle et les permissions de l&apos;utilisateur.
                                </p>
                            </div>

                            {/* Rôle */}
                            <div className="sm:col-span-6">
                                <fieldset>
                                    <legend className="text-sm font-medium text-gray-700">Rôle *</legend>
                                    <div className="mt-4 space-y-4">
                                        {roleOptions.map((option) => (
                                            <div key={option.value} className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id={option.value}
                                                        name="role"
                                                        type="radio"
                                                        value={option.value}
                                                        checked={formData.role === option.value}
                                                        onChange={handleChange}
                                                        className="focus:ring-[#F26419] h-4 w-4 text-[#F26419] border-gray-300"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor={option.value} className="font-medium text-gray-700">
                                                        {option.label}
                                                    </label>
                                                    <p className="text-gray-500">{option.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.role && (
                                        <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                                    )}
                                </fieldset>
                            </div>

                            {/* Département (conditionnel) */}
                            {(formData.role === 'teacher' || formData.role === 'chef_departement') && (
                                <div className="sm:col-span-3">
                                    <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                                        Département *
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="departmentId"
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.departmentId ? 'border-red-300' : ''
                                            }`}
                                        >
                                            <option value="">Sélectionner un département</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.nom} ({dept.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departmentId && (
                                            <p className="mt-2 text-sm text-red-600">{errors.departmentId}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Statut */}
                            <div className="sm:col-span-3">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Statut
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="active">Actif</option>
                                        <option value="pending">En attente</option>
                                        <option value="inactive">Inactif</option>
                                    </select>
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="sm:col-span-6">
                                <hr className="my-4"/>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Mot de passe
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Définissez un mot de passe temporaire pour l&apos;utilisateur.
                                </p>
                            </div>

                            {/* Mot de passe */}
                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.password ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Minimum 6 caractères"
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="sm:col-span-3">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirmer le mot de passe *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        id="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.password_confirmation ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Confirmer le mot de passe"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            {/* Note importante */}
                            <div className="sm:col-span-6">
                                <div className="rounded-md bg-blue-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3 flex-1 md:flex md:justify-between">
                                            <p className="text-sm text-blue-700">
                                                L&apos;utilisateur recevra ses identifiants par email et devra changer son mot de passe lors de sa première connexion.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3">
                        <Link
                            href="/admin/users"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours...
                                </>
                            ) : (
                                'Créer l\'utilisateur'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Aide et conseils */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Conseils pour la création d&apos;utilisateurs
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Rôles et permissions</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• <strong>Enseignant</strong> : Gère ses cours et prend les présences</li>
                            <li>• <strong>Chef de Département</strong> : Supervise un département entier</li>
                            <li>• <strong>Administrateur</strong> : Accès complet au système</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Bonnes pratiques</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Utilisez l&apos;email institutionnel de l&apos;établissement</li>
                            <li>• Vérifiez que le département existe avant d&apos;assigner</li>
                            <li>• Le mot de passe temporaire doit être sécurisé</li>
                            <li>• Informez l&apos;utilisateur de ses identifiants</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}