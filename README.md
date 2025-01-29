# 📚 STUDAM - Student Attendance Manager
STUDAM est une application web de gestion des présences conçue pour les établissements d'enseignement. Elle permet aux enseignants, étudiants, chefs de département et administrateurs de gérer efficacement les présences aux cours. Le système utilise un capteur d'empreintes digitales pour authentifier les utilisateurs et enregistrer les données de présence.

## 🚀 Fonctions principales
- Authentification sécurisée : Utilisation d'un capteur d'empreintes digitales pour les enseignants et les étudiants.

- Collecte des présences : Enregistrement des présences en temps réel via un capteur d'empreintes.

- Tableau de bord : Interface intuitive pour visualiser et télécharger les données de présence.

- Gestion des utilisateurs : Création et gestion des comptes pour les enseignants, étudiants, chefs de département et administrateurs.

- Rapports : Génération de rapports de présence au format Excel.

## 🏗️ Architecture du Projet
```
📦 STUDAM
├── 📂 STUDAM_SITE_WEB  # Code source du site web (Laravel)
├── 📂 Weekly_Reports
├── 📄 .gitignore
├── 📄 README.md
├── 📄 Abstract_Electronique.pdf
└── 📄 Bioclass_Innovators_Project.pdf
```

### 📝 Explication :

- STUDAM_SITE_WEB : contient le code source de l'application web Laravel

- Weekly_Reports : rapports hebdomadaires pour le suivi du projet

- Abstract_Electronique.pdf : document expliquant l'architecture électronique

- Bioclass Innovators Project.pdf : description globale du projet

## ⚙️ Installation et Lancement

### 📌 Prérequis

- PHP >= 8.3

- Composer

- MySQL

### 📥 Clonage du projet

`git clone https://github.com/dtl06/STUDAM.git`
`cd STUDAM/STUDAM_SITE_WEB`

### 🔧 Configuration

1. Copier le fichier `.env.example` et le renommer en `.env` :
   
`cp .env.example .env`

2. Installer les dépendances PHP:

`composer install`

3. Générer la clé de l'application :

`php artisan key:generate`

4. Configurer la base de données dans `.env` puis exécuter :

`php artisan migrate --seed`

5. Lancer le serveur :

`php artisan serve`

L'application sera accessible à l'adresse `http://127.0.0.1:8000`.

## 🚀 Fonctionnalités Principales

1. Collecte des présences

- L'enseignant s'authentifie sur le capteur biométrique.

- Les étudiants valident leur présence via le capteur.

- L'enseignant clôture l'enregistrement.

- Les données sont envoyées au serveur en temps réel.

2. Gestion des utilisateurs

- Enregistrement des enseignants : par le chef de département

- Enregistrement des CDD : par l'administrateur

- Enregistrement des étudiants : via importation de fichier Excel

3. Téléchargement des rapports

- L'enseignant peut télécharger un fichier Excel contenant les données de présence.

4. Construction des emplois du temps

- Le chef de département peut gérer les horaires et enregistrer les matières directement dans le système.

## 🛠️ Contributeurs

***Bioclass Innovators* - Équipe de développement**
* [DONCHI Tresor](tresorleroyd@gmail.com)
* [KENFACK Franck]
* [LADO SAHA]
* [MBEUYO Audrey](mbeuyoaudrey@gmail.com)
* [MENGOSSO Adrien](amengosso@gmail.com)
* [NOUKOUA Maëva](noukouamaeva@gmail.com)
* [TCHASSI Daniel]

  
## 📜 Licence

Projet sous licence MIT. Vous êtes libres de l'utiliser, de le modifier et de le partager.

***🎯 STUDAM - Moderniser la gestion des présences académiques 📚***


