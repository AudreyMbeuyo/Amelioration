/**
 * Middleware d'authentification pour STUDAM
 * Protège les routes qui nécessitent une authentification
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/about',
        '/contact',
        '/terms',
        '/privacy'
    ];

    // Routes d'administration qui nécessitent des permissions spéciales
    const adminRoutes = [
        '/admin',
        '/chef-departement'
    ];

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Si c'est une route publique, laisser passer
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Pour les autres routes, vérifier l'authentification
    const token = request.cookies.get('authToken')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    // Si pas de token, rediriger vers la page de connexion
    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Vérifier les permissions pour les routes d'administration
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute) {
        // Ici, vous pourriez décoder le token pour vérifier le rôle
        // Pour simplifier, on laisse passer (la vérification se fera côté composant)
        // TODO: Ajouter la vérification du rôle si nécessaire
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};