"use client";

import { useState } from "react";
import Link from "next/link"; // ✅ Corrige le <a> direct
const BACKEND_URL = "http://agence-voyage.ddns.net:9026/api";

export default function BackendTestPage() {
    const [testResults, setTestResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const generateUniqueId = () =>
        Date.now().toString(36) + Math.random().toString(36).slice(2);

    const generateTestUser = (role) => {
        const id = generateUniqueId();
        const roles = {
            admin: "Admin Principal",
            chef_departement: "Chef Département",
            teacher: "Enseignant",
        };

        return {
            nom: `${roles[role]} Test ${id}`,
            email: `test.${role}.${id}@studam.test`,
            password: "TestPassword123!",
            password_confirmation: "TestPassword123!",
            role: role,
        };
    };

    const testConnectivity = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/health`);
            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                message: response.ok ? "Backend accessible" : "Backend inaccessible",
            };
            setTestResults((prev) => ({ ...prev, connectivity: result }));
        } catch (error) {
            const result = {
                success: false,
                error: error.message,
                message: "Impossible de se connecter au backend",
            };
            setTestResults((prev) => ({ ...prev, connectivity: result }));
        }
        setIsLoading(false);
    };

    const testRegistration = async (userType) => {
        setIsLoading(true);
        try {
            const userData = generateTestUser(userType);

            const response = await fetch(`${BACKEND_URL}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                console.warn("Impossible de parser la réponse JSON");
            }

            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                data: data,
                userData: userData,
                hasToken: !!data.token,
                hasUser: !!data.user,
                message: response.ok
                    ? "Inscription réussie"
                    : "Erreur d&apos;inscription",
            };

            setTestResults((prev) => ({
                ...prev,
                [`register_${userType}`]: result,
            }));
        } catch (error) {
            const result = {
                success: false,
                error: error.message,
                message: "Erreur lors du test d&apos;inscription",
            };
            setTestResults((prev) => ({
                ...prev,
                [`register_${userType}`]: result,
            }));
        }
        setIsLoading(false);
    };

    const testLogin = async (userType) => {
        setIsLoading(true);
        try {
            const registrationResult = testResults[`register_${userType}`];
            if (!registrationResult?.userData) {
                throw new Error(
                    "Aucune inscription trouvée pour ce type d&apos;utilisateur"
                );
            }

            const credentials = {
                email: registrationResult.userData.email,
                password: registrationResult.userData.password,
            };

            const response = await fetch(`${BACKEND_URL}/user/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                console.warn("Impossible de parser la réponse JSON");
            }

            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                data: data,
                hasToken: !!data.token,
                hasUser: !!data.user,
                message: response.ok
                    ? "Connexion réussie"
                    : "Erreur de connexion",
            };

            setTestResults((prev) => ({
                ...prev,
                [`login_${userType}`]: result,
            }));
        } catch (error) {
            const result = {
                success: false,
                error: error.message,
                message: "Erreur lors du test de connexion",
            };
            setTestResults((prev) => ({
                ...prev,
                [`login_${userType}`]: result,
            }));
        }
        setIsLoading(false);
    };

    const clearResults = () => {
        setTestResults({});
        console.clear();
    };

    const ResultCard = ({ title, result }) => {
        if (!result) return null;

        const isSuccess = result.success;
        const borderColor = isSuccess
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50";
        const textColor = isSuccess ? "text-green-800" : "text-red-800";
        const badgeColor = isSuccess
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";

        return (
            <div className={`border rounded-lg p-4 ${borderColor}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-semibold flex items-center ${textColor}`}>
                        {isSuccess ? "✅" : "❌"} {title}
                    </h3>
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${badgeColor}`}
                    >
            {isSuccess ? "SUCCÈS" : "ÉCHEC"}
          </span>
                </div>

                <div className="text-sm space-y-1">
                    <p>
                        <strong>Status HTTP:</strong> {result.status || "N/A"}
                    </p>
                    <p>
                        <strong>Message:</strong> {result.message}
                    </p>

                    {result.error && (
                        <p className="text-red-600">
                            <strong>Erreur:</strong> {result.error}
                        </p>
                    )}

                    {result.hasToken !== undefined && (
                        <p>
                            <strong>Token reçu:</strong> {result.hasToken ? "✅ Oui" : "❌ Non"}
                        </p>
                    )}

                    {result.hasUser !== undefined && (
                        <p>
                            <strong>Données utilisateur:</strong>{" "}
                            {result.hasUser ? "✅ Oui" : "❌ Non"}
                        </p>
                    )}

                    {result.data && Object.keys(result.data).length > 0 && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                📄 Voir la réponse serveur
                            </summary>
                            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
                        </details>
                    )}

                    {result.userData && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                👤 Voir les données d&apos;inscription
                            </summary>
                            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto">
                {JSON.stringify(
                    {
                        nom: result.userData.nom,
                        email: result.userData.email,
                        role: result.userData.role,
                        password: "***masqué***",
                    },
                    null,
                    2
                )}
              </pre>
                        </details>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">🧪 Test Backend STUDAM</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <button onClick={testConnectivity} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
                    🔗 Test Connectivité
                </button>
                <button onClick={() => testRegistration("admin")} disabled={isLoading} className="bg-purple-600 text-white px-4 py-2 rounded">
                    👑 Test Admin
                </button>
                <button onClick={() => testRegistration("teacher")} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded">
                    👨‍🏫 Test Enseignant
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ResultCard title="🔗 Connectivité Backend" result={testResults.connectivity} />
                <ResultCard title="👑 Inscription Admin" result={testResults.register_admin} />
                <ResultCard title="👨‍🏫 Inscription Enseignant" result={testResults.register_teacher} />
                <ResultCard title="🔐 Connexion Admin" result={testResults.login_admin} />
                <ResultCard title="🔐 Connexion Enseignant" result={testResults.login_teacher} />
            </div>

            <div className="flex gap-4">
                <button onClick={clearResults} className="bg-gray-600 text-white px-4 py-2 rounded">
                    🗑️ Effacer
                </button>
                {testResults.register_admin && (
                    <button onClick={() => testLogin("admin")} disabled={isLoading} className="bg-purple-100 text-purple-800 px-4 py-2 rounded">
                        🔐 Connexion Admin
                    </button>
                )}
                {testResults.register_teacher && (
                    <button onClick={() => testLogin("teacher")} disabled={isLoading} className="bg-green-100 text-green-800 px-4 py-2 rounded">
                        🔐 Connexion Enseignant
                    </button>
                )}
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">🌐 Navigation rapide</h2>
                <div className="flex gap-4 flex-wrap">
                    <Link href="/auth/login">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">🔐 Connexion</span>
                    </Link>
                    <Link href="/auth/register">
                        <span className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">📝 Inscription</span>
                    </Link>
                    <Link href="/dashboard">
                        <span className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">🏠 Dashboard</span>
                    </Link>
                    <Link href="/">
                        <span className="bg-gray-600 text-white px-4 py-2 rounded cursor-pointer">🏡 Accueil</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
