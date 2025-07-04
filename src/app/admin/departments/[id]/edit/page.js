"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditDepartment() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.id;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [availableChiefs, setAvailableChiefs] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        code: '',
        description: '',
        chefId: '',
        email: '',
        telephone: '',
        adresse: '',
        budget: '',
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
                loadDepartmentData();
                loadAvailableChiefs();
            } catch (error) {
                console.error('Erreur:', error);
                router.push('/auth/login');
            }
        }
    }, [router, departmentId]);

    const loadDepartmentData = async () => {
        try {
            setInitialLoading(true);

            // Données simulées - à remplacer par appel API réel
            const mockDepartment = {
                id: parseInt(departmentId),
                nom: 'Informatique',
                code: 'INFO',
                description: 'Département des Sciences Informatiques et Technologies de l\'Information. Formation complète en développement logiciel, réseaux, bases de données et intelligence artificielle.',
                chefId: 5,
                email: 'info@studam.edu',
                telephone: '+221 33 123 45 67',
                adresse: 'Bâtiment A, 2ème étage, Campus Principal',
                budget: 5000000,
                status: 'active'
            };

            setFormData({
                nom: mockDepartment.nom,
                code: mockDepartment.code,
                description: mockDepartment.description,
                chefId: mockDepartment.chefId || '',
                email: mockDepartment.email || '',
                telephone: mockDepartment.telephone || '',
                adresse: mockDepartment.adresse || '',
                budget: mockDepartment.budget || '',
                status: mockDepartment.status
            });

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            router.push('/admin/departments');
        } finally {
            setInitialLoading(false);
        }
    };

    const loadAvailableChiefs = async () => {
        try {
            // Données simulées - utilisateurs disponibles pour être chef de département
            const mockChiefs = [
                {
                    id: 5,
                    name: 'Dr. Cheikh Anta Diop',
                    email: 'chef.info@studam.edu',
                    specialite: 'Intelligence Artificielle'
                },
                {
                    id: 10,
                    name: 'Dr. Fatou Diagne',
                    email: 'f.diagne@studam.edu',
                    specialite: 'Gestion Administrative'
                },
                {
                    id: 11,
                    name: 'Prof. Mamadou Ba',
                    email: 'm.ba@studam.edu',
                    specialite: 'Sciences Appliquées'
                }
            ];

            setAvailableChiefs(mockChiefs);
        } catch (error) {
            console.error('Erreur lors du chargement des chefs disponibles:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Effacer l'erreur correspondante
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validation nom
        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom du département est requis";
        } else if (formData.nom.trim().length < 3) {
            newErrors.nom = "Le nom doit contenir au moins 3 caractères";
        }

        // Validation code
        if (!formData.code.trim()) {
            newErrors.code = "Le code du département est requis";
        } else if (formData.code.length < 2 || formData.code.length > 8) {
            newErrors.code = "Le code doit contenir entre 2 et 8 caractères";
        } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
            newErrors.code = "Le code ne peut contenir que des lettres majuscules et des chiffres";
        }

        // Validation description
        if (!formData.description.trim()) {
            newErrors.description = "La description est requise";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "La description doit contenir au moins 10 caractères";
        }

        // Validation email (optionnel mais doit être valide si fourni)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'adresse email n'est pas valide";
        }

        // Validation budget (optionnel mais doit être numérique si fourni)
        if (formData.budget && (isNaN(formData.budget) || parseFloat(formData.budget) < 0)) {
            newErrors.budget = "Le budget doit être un nombre positif";
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
                nom: formData.nom.trim(),
                code: formData.code.trim().toUpperCase(),
                description: formData.description.trim(),
                ...(formData.chefId && { chefId: parseInt(formData.chefId) }),
                ...(formData.email && { email: formData.email.trim().toLowerCase() }),
                ...(formData.telephone && { telephone: formData.telephone.trim() }),
                ...(formData.adresse && { adresse: formData.adresse.trim() }),
                ...(formData.budget && { budget: parseFloat(formData.budget) }),
                status: formData.status
            };

            console.log('Données à mettre à jour:', apiData);

            // Simulation d'appel API - à remplacer par un vrai appel
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccessMessage(`Département "${formData.nom}" mis à jour avec succès !`);

            // Rediriger vers les détails du département après 2 secondes
            setTimeout(() => {
                router.push(`/admin/departments/${departmentId}`);
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            setErrors({ general: error.message || 'Erreur lors de la mise à jour du département' });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26419] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
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
                                        {formData.nom}
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="ml-4 text-sm font-medium text-gray-500">Modifier</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Modifier le département
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Modifiez les informations du département {formData.nom}.
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

                            {/* Informations de base */}
                            <div className="sm:col-span-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Informations de base
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Modifiez les informations principales du département.
                                </p>
                            </div>

                            {/* Nom du département */}
                            <div className="sm:col-span-3">
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                    Nom du département *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="nom"
                                        id="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.nom ? 'border-red-300' : ''
                                        }`}
                                        placeholder="Ex: Informatique et Technologies"
                                    />
                                    {errors.nom && (
                                        <p className="mt-2 text-sm text-red-600">{errors.nom}</p>
                                    )}
                                </div>
                            </div>

                            {/* Code du département */}
                            <div className="sm:col-span-3">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                    Code du département *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md uppercase ${
                                            errors.code ? 'border-red-300' : ''
                                        }`}
                                        placeholder="INFO"
                                        maxLength="8"
                                    />
                                    {errors.code && (
                                        <p className="mt-2 text-sm text-red-600">{errors.code}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description *
                                </label>
                                <div className="mt-1">
                  <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.description ? 'border-red-300' : ''
                      }`}
                      placeholder="Décrivez la mission, les objectifs et les domaines d'expertise de ce département..."
                  />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="sm:col-span-6">
                                <hr className="my-4"/>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Gestion et contact
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Modifiez le chef de département et les informations de contact.
                                </p>
                            </div>

                            {/* Chef de département */}
                            <div className="sm:col-span-3">
                                <label htmlFor="chefId" className="block text-sm font-medium text-gray-700">
                                    Chef de département
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="chefId"
                                        name="chefId"
                                        value={formData.chefId}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Aucun chef assigné</option>
                                        {availableChiefs.map((chief) => (
                                            <option key={chief.id} value={chief.id}>
                                                {chief.name} - {chief.specialite}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

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
                                        <option value="inactive">Inactif</option>
                                        <option value="planning">En planification</option>
                                    </select>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email du département
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
                                        placeholder="info@studam.edu"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="sm:col-span-3">
                                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                    Téléphone
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="tel"
                                        name="telephone"
                                        id="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="+221 33 123 45 67"
                                    />
                                </div>
                            </div>

                            {/* Adresse */}
                            <div className="sm:col-span-4">
                                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                    Adresse physique
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="adresse"
                                        id="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Bâtiment A, 2ème étage, Campus Principal"
                                    />
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="sm:col-span-2">
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                    Budget annuel (FCFA)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="budget"
                                        id="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md ${
                                            errors.budget ? 'border-red-300' : ''
                                        }`}
                                        placeholder="5000000"
                                        min="0"
                                    />
                                    {errors.budget && (
                                        <p className="mt-2 text-sm text-red-600">{errors.budget}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3">
                        <Link
                            href={`/admin/departments/${departmentId}`}
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
                                    Mise à jour...
                                </>
                            ) : (
                                'Mettre à jour'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-4">
                    Informations importantes
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <h4 className="text-sm font-medium text-yellow-900 mb-2">Changement de chef</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Le changement de chef sera effectif immédiatement</li>
                            <li>• L&apos;ancien chef sera notifié automatiquement</li>
                            <li>• Les permissions seront transférées</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-yellow-900 mb-2">Modification du statut</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Un département inactif masque ses cours</li>
                            <li>• Les enseignants ne peuvent plus prendre de présences</li>
                            <li>• Les étudiants gardent leur accès en lecture</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}