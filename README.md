# holbertonschool-files_manager


🗂️ holbertonschool-files_manager – Présentation
🎯 Objectif :
Créer une API pour :

Gérer les utilisateurs (authentification par token)

Gérer des fichiers (upload, affichage, partage)

Gérer les permissions (public/privé)

Stocker les données dans MongoDB

Utiliser Redis pour la gestion des sessions

🔧 Stack technique :
Node.js

Express.js – pour l’API REST

MongoDB – pour stocker les utilisateurs et fichiers

Redis – pour les tokens d’authentification

Filesystem (local) – les fichiers sont stockés localement

📁 Structure générale attendue
bash

holbertonschool-files_manager/
├── controllers/
│   └── UsersController.js
│   └── FilesController.js
│   └── AppController.js
├── routes/
│   └── index.js
├── utils/
│   └── db.js
│   └── redis.js
├── models/
├── tests/
├── app.js
├── package.json
└── README.md
✅ Fonctions clés à implémenter
🔐 Authentification
POST /users – créer un utilisateur

GET /users/me – récupérer les infos de l’utilisateur connecté

Auth via un header X-Token (stocké dans Redis)

📦 Gestion de fichiers
POST /files – uploader un fichier

GET /files/:id – obtenir les métadonnées

GET /files – lister tous les fichiers de l’utilisateur

PUT /files/:id/publish – rendre un fichier public

PUT /files/:id/unpublish – rendre un fichier privé

GET /files/:id/data – accéder au contenu du fichier

🧪 Tests
Tu dois écrire des tests unitaires et fonctionnels (avec mocha, chai, ou jest selon les consignes).

💡 Conseils de réussite
Commence petit : fais d’abord AppController et UsersController.

Teste Redis et Mongo en local avant de tout coder.

Respecte bien les routes REST et les statuts HTTP (201, 401, 404, etc.).

Utilise Postman ou curl pour tester tes endpoints manuellement.

Utilise uuid pour générer les tokens.

Utilise fs (filesystem) pour stocker les fichiers dans un dossier local.

📘 Exemple de db.js (MongoDB utils)
js

const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`, { useUnifiedTopology: true });
    this.client.connect();
    this.db = this.client.db(dbName);
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
