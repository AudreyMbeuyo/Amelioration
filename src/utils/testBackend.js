/**
 * Outil de test pour vérifier la connexion au backend STUDAM
 * À utiliser en développement pour diagnostiquer les problèmes
 */

const BACKEND_URL = 'http://agence-voyage.ddns.net:9026/api';

/**
 * Teste la connectivité de base au backend
 */
export async function testBackendConnection() {
    console.log('🔍 Test de connectivité au backend...');

    try {
        // Test simple de ping
        const response = await fetch(`${BACKEND_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('📡 Réponse du serveur:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
        });

        return {
            success: response.ok,
            status: response.status,
            message: response.ok ? 'Backend accessible' : 'Backend inaccessible'
        };

    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        return {
            success: false,
            error: error.message,
            message: 'Impossible de se connecter au backend'
        };
    }
}

/**
 * Teste l'endpoint d'inscription
 */
export async function testRegisterEndpoint(userData) {
    console.log('🧪 Test de l\'endpoint d\'inscription...');

    try {
        const response = await fetch(`${BACKEND_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json().catch(() => ({}));

        console.log('📊 Résultat du test d\'inscription:', {
            status: response.status,
            success: response.ok,
            data: data,
            hasToken: !!data.token,
            hasUser: !!data.user
        });

        return {
            success: response.ok,
            status: response.status,
            data: data,
            message: response.ok ? 'Inscription fonctionnelle' : 'Erreur d\'inscription'
        };

    } catch (error) {
        console.error('❌ Erreur test inscription:', error);
        return {
            success: false,
            error: error.message,
            message: 'Erreur lors du test d\'inscription'
        };
    }
}

/**
 * Teste l'endpoint de connexion
 */
export async function testLoginEndpoint(credentials) {
    console.log('🔑 Test de l\'endpoint de connexion...');

    try {
        const response = await fetch(`${BACKEND_URL}/user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json().catch(() => ({}));

        console.log('📊 Résultat du test de connexion:', {
            status: response.status,
            success: response.ok,
            data: data,
            hasToken: !!data.token,
            hasUser: !!data.user
        });

        return {
            success: response.ok,
            status: response.status,
            data: data,
            message: response.ok ? 'Connexion fonctionnelle' : 'Erreur de connexion'
        };

    } catch (error) {
        console.error('❌ Erreur test connexion:', error);
        return {
            success: false,
            error: error.message,
            message: 'Erreur lors du test de connexion'
        };
    }
}

/**
 * Exécute une batterie complète de tests
 */
export async function runFullBackendTest() {
    console.log('🚀 Démarrage des tests backend complets...');

    const results = {
        connectivity: null,
        register: null,
        login: null,
        overall: false
    };

    // Test 1: Connectivité
    results.connectivity = await testBackendConnection();

    if (!results.connectivity.success) {
        console.log('❌ Tests arrêtés - Backend inaccessible');
        return results;
    }

    // Test 2: Inscription (avec données de test)
    const testUserData = {
        nom: `Test User ${Date.now()}`,
        email: `test.${Date.now()}@studam.test`,
        password: 'TestPassword123',
        password_confirmation: 'TestPassword123',
        role: 'teacher'
    };

    results.register = await testRegisterEndpoint(testUserData);

    // Test 3: Connexion (avec les mêmes données si inscription réussie)
    if (results.register.success) {
        results.login = await testLoginEndpoint({
            email: testUserData.email,
            password: testUserData.password
        });
    }

    // Évaluation globale
    results.overall = results.connectivity.success &&
        results.register.success &&
        (results.login?.success ?? false);

    console.log('📋 Résumé des tests:', results);

    return results;
}

/**
 * Utilitaire pour tester manuellement depuis la console
 */
if (typeof window !== 'undefined') {
    window.testSTUDAMBackend = runFullBackendTest;
    window.testConnection = testBackendConnection;
    window.testRegister = testRegisterEndpoint;
    window.testLogin = testLoginEndpoint;
}