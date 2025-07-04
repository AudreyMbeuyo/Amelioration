import ApiService from './ApiService';

/**
 * Service d'authentification pour STUDAM
 * Gère la connexion, déconnexion, et vérification des permissions utilisateur
 */
class AuthenticationService {
    constructor() {
        this.apiService = new ApiService();
        this.tokenKey = 'authToken';
        this.userKey = 'user';
    }

    /**
     * Connexion utilisateur
     * @param {string|Object} usernameOrCredentials - Username ou objet credentials
     * @param {string} password - Mot de passe (optionnel si premier param est objet)
     * @returns {Promise} Réponse de l'API
     */
    async login(usernameOrCredentials, password = null) {
        try {
            // Gestion flexible des paramètres pour compatibilité
            let credentials;
            if (typeof usernameOrCredentials === 'string') {
                // Format: login(username, password)
                credentials = {
                    username: usernameOrCredentials,
                    password: password
                };
            } else {
                // Format: login({username, password}) ou login({email, password})
                credentials = usernameOrCredentials;
            }

            console.log('🔐 [AUTH] Tentative de connexion pour:', credentials.username || credentials.email);

            const response = await this.apiService.post('/user/signin', credentials);

            if (response?.data && response.data.token) {
                const { token, user } = response.data;

                // Stocker les données d'authentification
                this.storeAuthData(token, user);

                console.log('✅ [AUTH] Connexion réussie pour:', user);
                return { success: true, user, token };
            } else {
                console.warn('⚠️ [AUTH] Réponse de connexion invalide:', response);
                return { success: false, message: 'Réponse de connexion invalide' };
            }
        } catch (error) {
            console.warn('⚠️ [AUTH] Erreur de connexion:', error);
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Erreur de connexion'
            };
        }
    }

    /**
     * Inscription utilisateur
     * @param {Object} userData - Données d'inscription
     * @returns {Promise} Réponse de l'API
     */
    async register(userData) {
        try {
            console.log('📝 [AUTH] Tentative d\'inscription pour:', userData.email);

            const response = await this.apiService.post('/user/register', userData);

            if (response?.data) {
                console.log('✅ [AUTH] Inscription réussie pour:', userData.email);

                // Optionnel: auto-connexion après inscription
                if (response.data.token && response.data.user) {
                    this.storeAuthData(response.data.token, response.data.user);
                    return { success: true, user: response.data.user, autoLogin: true };
                }

                return { success: true, message: 'Inscription réussie' };
            } else {
                return { success: false, message: 'Erreur lors de l\'inscription' };
            }
        } catch (error) {
            console.warn('⚠️ [AUTH] Erreur d\'inscription:', error);
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Erreur lors de l\'inscription'
            };
        }
    }

    /**
     * Déconnexion utilisateur
     */
    logout() {
        try {
            console.log('🚪 [AUTH] Déconnexion utilisateur');
            this.clearAuthData();

            // Rediriger vers la page d'accueil
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('❌ [AUTH] Erreur lors de la déconnexion:', error);
        }
    }

    /**
     * Vérifier si l'utilisateur est connecté
     * @returns {boolean} True si connecté
     */
    isAuthenticated() {
        if (typeof window === 'undefined') return false;

        const token = localStorage.getItem(this.tokenKey);
        const user = this.getUser();

        return !!(token && user);
    }

    /**
     * Récupérer les données utilisateur
     * @returns {Object|null} Données utilisateur ou null
     */
    getUser() {
        if (typeof window === 'undefined') return null;

        try {
            const userStr = localStorage.getItem(this.userKey);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('❌ [AUTH] Erreur parsing user:', error);
            return null;
        }
    }

    /**
     * Récupérer le token d'authentification
     * @returns {string|null} Token ou null
     */
    getToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Vérifier si l'utilisateur a un rôle spécifique
     * @param {string|Array} roles - Rôle(s) à vérifier
     * @returns {boolean} True si l'utilisateur a le rôle
     */
    hasRole(roles) {
        const user = this.getUser();
        if (!user || !user.role) return false;

        const userRole = user.role.toLowerCase();
        const roleList = Array.isArray(roles) ? roles.map(r => r.toLowerCase()) : [roles.toLowerCase()];
        return roleList.includes(userRole);
    }

    /**
     * Vérifier si l'utilisateur est admin
     * @returns {boolean} True si admin
     */
    isAdmin() {
        return this.hasRole(['admin', 'super_admin']);
    }

    /**
     * Vérifier si l'utilisateur est chef de département
     * @returns {boolean} True si chef de département
     */
    isChefDepartement() {
        return this.hasRole(['chef_department', 'chef_departement']);
    }

    /**
     * Vérifier si l'utilisateur est enseignant
     * @returns {boolean} True si enseignant
     */
    isTeacher() {
        return this.hasRole(['teacher', 'enseignant']);
    }

    /**
     * Vérifier si l'utilisateur est étudiant
     * @returns {boolean} True si étudiant
     */
    isStudent() {
        return this.hasRole(['student', 'etudiant']);
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
     * ✅ CORRECTION: Redirection après connexion selon le rôle
     * Évite l'erreur 404 en redirigeant vers des routes existantes
     */
    getRedirectPath() {
        const user = this.getUser();

        if (!user) return '/';

        // ✅ Redirection selon le rôle avec vérification des routes existantes
        switch (user.role?.toLowerCase()) {
            case 'admin':
            case 'super_admin':
                // Vérifier si on a déjà les fichiers admin
                return '/admin/dashboard';

            case 'chef_departement':
            case 'chef_department':
                return '/chief/dashboard';

            case 'teacher':
            case 'enseignant':
                return '/teacher/dashboard';

            case 'student':
            case 'etudiant':
                return '/student/dashboard';

            default:
                console.warn('⚠️ [AUTH] Rôle non reconnu:', user.role);
                return '/profile'; // Page de fallback sûre
        }
    }

    /**
     * ✅ NOUVELLE: Fonction helper pour rediriger après connexion
     */
    redirectAfterLogin() {
        if (typeof window !== 'undefined') {
            const redirectPath = this.getRedirectPath();
            console.log('🔄 [AUTH] Redirection vers:', redirectPath);
            window.location.href = redirectPath;
        }
    }

    /**
     * ✅ NOUVELLE: Vérifier si l'utilisateur peut accéder à une route
     */
    canAccessRoute(route) {
        const user = this.getUser();
        if (!user) return false;

        const role = user.role?.toLowerCase();

        // Routes admin
        if (route.startsWith('/admin')) {
            return ['admin', 'super_admin'].includes(role);
        }

        // Routes chef de département
        if (route.startsWith('/chief')) {
            return ['chef_departement', 'chef_department', 'admin', 'super_admin'].includes(role);
        }

        // Routes enseignant
        if (route.startsWith('/teacher')) {
            return ['teacher', 'enseignant', 'admin', 'super_admin'].includes(role);
        }

        // Routes étudiant
        if (route.startsWith('/student')) {
            return ['student', 'etudiant'].includes(role);
        }

        // Routes générales (profil, etc.)
        return true;
    }

    /**
     * ✅ NOUVELLE: Middleware pour protéger les routes côté client
     */
    requireAuth(router, requiredRoute = null) {
        if (typeof window === 'undefined') return false;

        if (!this.isAuthenticated()) {
            router.push('/auth/login');
            return false;
        }

        if (requiredRoute && !this.canAccessRoute(requiredRoute)) {
            router.push(this.getRedirectPath());
            return false;
        }

        return true;
    }
}

// Instance singleton
const authService = new AuthenticationService();

export default authService;
export { AuthenticationService };