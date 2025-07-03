/**
 * Service d'authentification pour STUDAM
 * Gère la connexion, l'inscription et la session utilisateur
 * Conforme à l'architecture backend Laravel
 */

import { ApiService } from './ApiService';

class AuthenticationService {
    constructor() {
        this.apiService = new ApiService();
        this.tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || 'authToken';
        this.userKey = process.env.NEXT_PUBLIC_USER_KEY || 'user';
        this.debugMode = process.env.NEXT_PUBLIC_DEBUG_API === 'true';
    }

    /**
     * Log de débogage conditionnel
     */
    log(message, data = null) {
        if (this.debugMode && process.env.NEXT_PUBLIC_CONSOLE_LOGS === 'true') {
            console.log(`[AuthService] ${message}`, data || '');
        }
    }

    /**
     * 🔧 CORRECTION CRITIQUE: Connexion utilisateur avec USERNAME au lieu d'EMAIL
     * @param {string} emailOrUsername - Email OU Username de l'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Promise<Object>} Données de l'utilisateur connecté
     */
    async login(emailOrUsername, password) {
        this.log('🔐 Tentative de connexion', { emailOrUsername });

        try {
            const endpoint = process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || '/user/signin';

            // ✅ CORRECTION: Backend attend "username" et "password" uniquement
            const response = await this.apiService.post(endpoint, {
                username: emailOrUsername.trim(), // ✅ "username" au lieu d'"email"
                password: password
            }, false); // false = pas d'auth header pour login

            this.log('✅ Réponse de connexion reçue', {
                hasToken: !!response.token,
                hasUser: !!response.user,
                userRole: response.user?.role
            });

            // Sauvegarder le token et les données utilisateur
            if (response.token) {
                this.storeAuthData(response.token, response.user);
                this.log('💾 Données d\'authentification sauvegardées');
            }

            return {
                success: true,
                user: response.user,
                token: response.token,
                message: 'Connexion réussie'
            };

        } catch (error) {
            this.log('❌ Erreur de connexion', error);

            // Gestion des erreurs spécifiques du backend
            if (error.status === 401) {
                throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
            } else if (error.status === 422) {
                throw new Error('Données de connexion invalides');
            } else if (error.status >= 500) {
                throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
            } else if (error.status === 0) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            }

            throw new Error(error.message || 'Erreur lors de la connexion');
        }
    }

    /**
     * ✅ CORRECTION: Inscription utilisateur avec tous les champs requis
     * @param {Object} userData - Données de l'utilisateur
     * @returns {Promise<Object>} Données de l'utilisateur inscrit
     */
    async register(userData) {
        this.log('📝 Tentative d\'inscription', {
            email: userData.email,
            username: userData.username,
            role: userData.role
        });

        try {
            const endpoint = process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT || '/user/register';

            // ✅ PARFAITEMENT CONFORME AU BACKEND
            const registrationData = {
                name: userData.name?.trim(),              // ✅ "name" (pas "nom")
                email: userData.email?.trim().toLowerCase(),
                password: userData.password,
                phoneNumber: userData.phoneNumber?.trim(), // ✅ Champ requis
                username: userData.username?.trim(),       // ✅ Champ requis
                role: userData.role                        // ✅ Valeurs: ADMIN, TEACHER, CHEF_DEPARTMENT
            };

            this.log('📤 Envoi des données d\'inscription', {
                ...registrationData,
                password: '***masqué***'
            });

            const response = await this.apiService.post(endpoint, registrationData, false);

            this.log('✅ Réponse d\'inscription reçue', {
                hasToken: !!response.token,
                hasUser: !!response.user,
                userRole: response.user?.role
            });

            // Sauvegarder le token et les données utilisateur si fournis
            if (response.token) {
                this.storeAuthData(response.token, response.user);
                this.log('💾 Auto-connexion après inscription');
            }

            return {
                success: true,
                user: response.user,
                token: response.token,
                message: 'Inscription réussie',
                autoLogin: !!response.token
            };

        } catch (error) {
            this.log('❌ Erreur d\'inscription', error);

            // Gestion des erreurs spécifiques du backend
            if (error.status === 409) {
                throw new Error('Cette adresse email ou ce nom d\'utilisateur est déjà utilisé');
            } else if (error.status === 422) {
                // Erreurs de validation - renvoyer les détails
                if (error.data && error.data.errors) {
                    const validationErrors = error.data.errors;
                    const firstError = Object.values(validationErrors)[0];
                    throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
                }
                throw new Error('Données d\'inscription invalides');
            } else if (error.status >= 500) {
                throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
            } else if (error.status === 0) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            }

            throw new Error(error.message || 'Erreur lors de l\'inscription');
        }
    }

    /**
     * Déconnexion utilisateur
     */
    async logout() {
        this.log('🚪 Déconnexion en cours');

        try {
            // Tenter de notifier le serveur de la déconnexion
            const endpoint = process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT || '/user/logout';
            await this.apiService.post(endpoint, {}, true); // true = avec auth header
        } catch (error) {
            // La déconnexion côté serveur peut échouer, mais on continue la déconnexion locale
            this.log('⚠️ Erreur lors de la déconnexion serveur (on continue)', error.message);
        } finally {
            // Toujours nettoyer les données locales
            this.clearAuthData();
            this.log('🧹 Données d\'authentification supprimées');
        }
    }

    /**
     * Récupérer le profil utilisateur
     * @returns {Promise<Object>} Profil utilisateur mis à jour
     */
    async getProfile() {
        this.log('👤 Récupération du profil utilisateur');

        try {
            const endpoint = process.env.NEXT_PUBLIC_AUTH_PROFILE_ENDPOINT || '/user/profile';
            const response = await this.apiService.get(endpoint, true);

            // Mettre à jour les données utilisateur locales
            if (response.user) {
                this.updateUserData(response.user);
                this.log('🔄 Profil utilisateur mis à jour');
            }

            return response.user;
        } catch (error) {
            this.log('❌ Erreur lors de la récupération du profil', error);

            if (error.status === 401) {
                // Token invalide, déconnecter l'utilisateur
                this.clearAuthData();
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }

            throw new Error(error.message || 'Impossible de récupérer le profil');
        }
    }

    /**
     * Vérifier si l'utilisateur est authentifié
     * @returns {boolean} État d'authentification
     */
    isAuthenticated() {
        if (typeof window === 'undefined') return false;

        const token = this.getToken();
        const user = this.getUser();

        const isAuth = !!(token && user);
        this.log('🔍 Vérification d\'authentification', {
            hasToken: !!token,
            hasUser: !!user,
            isAuthenticated: isAuth
        });

        return isAuth;
    }

    /**
     * Récupérer le token d'authentification
     * @returns {string|null} Token d'authentification
     */
    getToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Récupérer les données utilisateur
     * @returns {Object|null} Données utilisateur
     */
    getUser() {
        if (typeof window === 'undefined') return null;

        try {
            const userStr = localStorage.getItem(this.userKey);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            this.log('⚠️ Erreur lors de la lecture des données utilisateur', error);
            return null;
        }
    }

    /**
     * Récupérer le rôle de l'utilisateur
     * @returns {string|null} Rôle de l'utilisateur
     */
    getUserRole() {
        const user = this.getUser();
        return user?.role || null;
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     * @param {string|Array} roles - Rôle(s) à vérifier
     * @returns {boolean} True si l'utilisateur a le rôle
     */
    hasRole(roles) {
        const userRole = this.getUserRole();
        if (!userRole) return false;

        const roleList = Array.isArray(roles) ? roles : [roles];
        return roleList.includes(userRole);
    }

    /**
     * ✅ CORRECTION: Méthodes de vérification rôle adaptées aux nouvelles valeurs
     */
    isAdmin() {
        return this.hasRole(['ADMIN', 'admin', 'super_admin']);
    }

    /**
     * Vérifier si l'utilisateur est chef de département
     * @returns {boolean} True si chef de département
     */
    isChefDepartement() {
        return this.hasRole(['CHEF_DEPARTMENT', 'chef_departement']);
    }

    /**
     * Vérifier si l'utilisateur est enseignant
     * @returns {boolean} True si enseignant
     */
    isTeacher() {
        return this.hasRole(['TEACHER', 'teacher']);
    }

    /**
     * Sauvegarder les données d'authentification
     * @private
     */
    storeAuthData(token, user) {
        if (typeof window === 'undefined') return;

        localStorage.setItem(this.tokenKey, token);
        if (user) {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        }

        // Informer l'ApiService du nouveau token
        this.apiService.setAuthToken(token);
    }

    /**
     * Mettre à jour les données utilisateur
     * @private
     */
    updateUserData(user) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * Supprimer les données d'authentification
     * @private
     */
    clearAuthData() {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);

        // Informer l'ApiService de la suppression du token
        this.apiService.clearAuthToken();
    }

    /**
     * ✅ CORRECTION: Redirection après connexion selon le rôle avec nouvelles valeurs
     */
    getRedirectPath() {
        const user = this.getUser();
        const defaultPath = process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_AFTER_LOGIN || '/dashboard';

        if (!user) return defaultPath;

        // Redirection personnalisée selon le rôle (supporter anciennes ET nouvelles valeurs)
        switch (user.role) {
            case 'ADMIN':
            case 'admin':
            case 'super_admin':
                return '/admin/dashboard';
            case 'CHEF_DEPARTMENT':
            case 'chef_departement':
                return '/chef-departement/dashboard';
            case 'TEACHER':
            case 'teacher':
                return '/teacher/dashboard';
            case 'STUDENT':
            case 'student':
                return '/student/dashboard';
            default:
                return defaultPath;
        }
    }
}

// Instance singleton
const authService = new AuthenticationService();

export default authService;
export { AuthenticationService };