<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>STUDAM - Système de Gestion des Présences</title>
    
    <!-- Scripts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- Styles -->
    <style>
        .bg-navy { background-color: #1B396A; }
        .text-navy { color: #1B396A; }
        .bg-orange { background-color: #F26419; }
        .text-orange { color: #F26419; }
        .border-orange { border-color: #F26419; }
        .hover\:bg-orange-dark:hover { background-color: #d55615; }
        .focus\:ring-orange:focus { --tw-ring-color: #F26419; }
        .focus\:border-orange:focus { border-color: #F26419; }
    </style>
</head>
<body class="font-sans antialiased">
    <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="{{ route('home') }}" class="text-2xl font-bold text-navy">
                            STUDAM
                        </a>
                    </div>
                </div>
                
                <div class="flex items-center">
                    @guest
                        <a href="{{ route('login') }}" class="text-navy hover:text-orange px-3 py-2 rounded-md text-sm font-medium">Connexion</a>
                        <a href="{{ route('register') }}" class="bg-orange text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium ml-4">Inscription</a>
                    @else
                        <div class="ml-3 relative">
                            <div class="flex items-center">
                                <span class="text-navy mr-4">{{ Auth::user()->nom }}</span>
                                <form method="POST" action="{{ route('logout') }}" class="inline">
                                    @csrf
                                    <button type="submit" class="text-navy hover:text-orange">
                                        Déconnexion
                                    </button>
                                </form>
                            </div>
                        </div>
                    @endguest
                </div>
            </div>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <footer class="bg-navy py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-white text-center">
                <p>&copy; {{ date('Y') }} STUDAM. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    @stack('scripts')
</body>
</html>