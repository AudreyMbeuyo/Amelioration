/**
 * Service API de base pour STUDAM
 * Classe utilitaire pour toutes les communications avec le backend Laravel
 */

class ApiService {
    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://agence-voyage.ddns.net:9026/api';
        this.tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || 'authToken';
        this.debugMode = process.env.NEXT_PUBLIC_DEBUG_API === 'true';
    }

    /**
     * Log de débogage conditionnel
     */
    log(message, data = null) {
        if (this.debugMode && process.env.NEXT_PUBLIC_CONSOLE_LOGS === 'true') {
            console.log(`[ApiService] ${message}`, data || '');
        }
    }

    /**
     * Récupérer le token d'authentification
     * @returns {string|null} Token d'authentification
     */
    getAuthToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Définir le token d'authentification
     * @param {string} token - Token d'authentification
     */
    setAuthToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    /**
     * Supprimer le token d'authentification
     */
    clearAuthToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
        }
    }

    /**
     * Construire les headers pour les requêtes
     * @param {boolean} includeAuth - Inclure le header d'authentification
     * @returns {Object} Headers de la requête
     */
    buildHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Effectuer une requête HTTP générique
     * @param {string} endpoint - Endpoint de l'API
     * @param {string} method - Méthode HTTP
     * @param {Object} data - Données à envoyer
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async request(endpoint, method = 'GET', data = null, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            method,
            headers: this.buildHeaders(includeAuth)
        };

        // Ajouter le body pour les méthodes qui l'acceptent
        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            config.body = JSON.stringify(data);
        }

        this.log(`${method.toUpperCase()} ${url}`, data);

        try {
            const response = await fetch(url, config);

            this.log(`Response ${response.status} ${response.statusText}`, {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            // Vérifier le type de contenu de la réponse
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');

            let responseData;
            if (isJson) {
                responseData = await response.json();
            } else {
                // Pour les réponses non-JSON (comme les téléchargements)
                responseData = await response.text();
            }

            // Gestion des erreurs HTTP
            if (!response.ok) {
                this.log('❌ Erreur HTTP', {
                    status: response.status,
                    data: responseData
                });

                // Structurer l'erreur pour une gestion cohérente
                const error = {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                    message: this.extractErrorMessage(responseData, response.status)
                };

                throw error;
            }

            this.log('✅ Succès', responseData);
            return responseData;

        } catch (error) {
            // Erreur de réseau ou autre erreur non-HTTP
            if (!error.status) {
                this.log('❌ Erreur réseau', error);
                throw {
                    status: 0,
                    message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
                    originalError: error
                };
            }

            // Relancer l'erreur HTTP structurée
            throw error;
        }
    }

    /**
     * Extraire le message d'erreur de la réponse
     * @private
     */
    extractErrorMessage(responseData, status) {
        // Si la réponse est un objet JSON avec un message
        if (typeof responseData === 'object' && responseData.message) {
            return responseData.message;
        }

        // Si c'est un objet avec des erreurs de validation
        if (typeof responseData === 'object' && responseData.errors) {
            const firstError = Object.values(responseData.errors)[0];
            return Array.isArray(firstError) ? firstError[0] : firstError;
        }

        // Messages par défaut selon le status
        switch (status) {
            case 400:
                return 'Requête invalide';
            case 401:
                return 'Non autorisé';
            case 403:
                return 'Accès interdit';
            case 404:
                return 'Ressource non trouvée';
            case 409:
                return 'Conflit de données';
            case 422:
                return 'Données invalides';
            case 429:
                return 'Trop de requêtes';
            case 500:
                return 'Erreur serveur interne';
            case 502:
                return 'Passerelle incorrecte';
            case 503:
                return 'Service indisponible';
            default:
                return `Erreur ${status}`;
        }
    }

    /**
     * Méthode GET
     * @param {string} endpoint - Endpoint de l'API
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async get(endpoint, includeAuth = true) {
        return this.request(endpoint, 'GET', null, includeAuth);
    }

    /**
     * Méthode POST
     * @param {string} endpoint - Endpoint de l'API
     * @param {Object} data - Données à envoyer
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async post(endpoint, data, includeAuth = true) {
        return this.request(endpoint, 'POST', data, includeAuth);
    }

    /**
     * Méthode PUT
     * @param {string} endpoint - Endpoint de l'API
     * @param {Object} data - Données à envoyer
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async put(endpoint, data, includeAuth = true) {
        return this.request(endpoint, 'PUT', data, includeAuth);
    }

    /**
     * Méthode PATCH
     * @param {string} endpoint - Endpoint de l'API
     * @param {Object} data - Données à envoyer
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async patch(endpoint, data, includeAuth = true) {
        return this.request(endpoint, 'PATCH', data, includeAuth);
    }

    /**
     * Méthode DELETE
     * @param {string} endpoint - Endpoint de l'API
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async delete(endpoint, includeAuth = true) {
        return this.request(endpoint, 'DELETE', null, includeAuth);
    }

    /**
     * Télécharger un fichier
     * @param {string} endpoint - Endpoint de l'API
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<Blob>} Fichier en tant que Blob
     */
    async downloadFile(endpoint, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            method: 'GET',
            headers: this.buildHeaders(includeAuth)
        };

        this.log(`DOWNLOAD ${url}`);

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: `Erreur lors du téléchargement: ${response.statusText}`
                };
            }

            const blob = await response.blob();
            this.log('✅ Téléchargement réussi', { size: blob.size });

            return blob;
        } catch (error) {
            this.log('❌ Erreur de téléchargement', error);
            throw error;
        }
    }

    /**
     * Uploader un fichier
     * @param {string} endpoint - Endpoint de l'API
     * @param {FormData} formData - Données du formulaire avec fichier
     * @param {boolean} includeAuth - Inclure l'authentification
     * @returns {Promise<any>} Réponse de l'API
     */
    async uploadFile(endpoint, formData, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;

        // Pour l'upload de fichier, ne pas définir Content-Type
        // Le navigateur le définira automatiquement avec boundary
        const headers = includeAuth ? {
            'Authorization': `Bearer ${this.getAuthToken()}`
        } : {};

        const config = {
            method: 'POST',
            headers,
            body: formData
        };

        this.log(`UPLOAD ${url}`);

        try {
            const response = await fetch(url, config);

            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');
            const responseData = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                throw {
                    status: response.status,
                    data: responseData,
                    message: this.extractErrorMessage(responseData, response.status)
                };
            }

            this.log('✅ Upload réussi', responseData);
            return responseData;

        } catch (error) {
            this.log('❌ Erreur d\'upload', error);
            if (!error.status) {
                throw {
                    status: 0,
                    message: 'Erreur lors de l\'upload du fichier'
                };
            }
            throw error;
        }
    }
}

export { ApiService };
export default ApiService;