# Tic Tac Toe Multiplayer

Application de jeu Tic Tac Toe en temps réel avec Next.js et Socket.IO.

## Structure du projet

```
├── app/                    # Application Next.js (Frontend)
├── BackEnd/               # Serveur Node.js Socket.IO (WebSocket)
│   ├── server.js         # Serveur WebSocket
│   └── package.json      # Dépendances backend
├── components/            # Composants React
├── lib/                  # Utilitaires et configuration
└── prisma/               # Base de données et migrations
```

## Installation

### 1. Installation des dépendances Next.js

```bash
npm install
```

### 2. Installation des dépendances Backend

```bash
npm run backend:install
```

## Démarrage

Cette application nécessite **deux serveurs** :
1. **Next.js** (port 3000) - Interface web
2. **Node.js Socket.IO** (port 3001) - Connexions WebSocket temps réel

### Démarrer les deux serveurs ensemble (recommandé):

```bash
npm run dev-all
```

### Ou les démarrer séparément:

**Terminal 1** - Serveur Next.js:
```bash
npm run dev
```

**Terminal 2** - Serveur Socket.IO:
```bash
npm run socket
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Navigateur Web                          │
│  ┌──────────────────┐        ┌──────────────────────┐       │
│  │   Next.js        │        │  Socket.IO Client    │       │
│  │   (React UI)     │        │  (WebSocket)         │       │
│  └────────┬─────────┘        └──────────┬───────────┘       │
└───────────┼──────────────────────────────┼───────────────────┘
            │                              │
            │ HTTP/API                     │ WebSocket
            │                              │
┌───────────▼──────────────────────────────▼───────────────────┐
│                      Serveurs                                 │
│  ┌──────────────────┐        ┌──────────────────────┐       │
│  │   Next.js        │        │  Node.js             │       │
│  │   Server         │        │  Socket.IO Server    │       │
│  │   Port 3000      │        │  Port 3001           │       │
│  │                  │        │  (BackEnd/)          │       │
│  └────────┬─────────┘        └──────────────────────┘       │
└───────────┼──────────────────────────────────────────────────┘
            │
            │ Prisma ORM
            │
┌───────────▼──────────────────────────────────────────────────┐
│                      Base de données MySQL                    │
└───────────────────────────────────────────────────────────────┘
```

### Pourquoi deux serveurs ?

Next.js ne supporte pas nativement les WebSockets en temps réel. C'est pourquoi:
- **Next.js** gère l'interface utilisateur et les API REST
- **Node.js + Socket.IO** gère les communications WebSocket pour le mode multijoueur

## Fonctionnalités

- Authentification utilisateur (inscription, connexion, réinitialisation mot de passe)
- Mode multijoueur en temps réel avec WebSocket
- Mode solo contre l'ordinateur
- Historique des parties
- Profils utilisateurs avec avatars
- Système de tours validé côté serveur

## Technologies

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS + DaisyUI
- Socket.IO Client

### Backend
- Node.js
- Socket.IO
- Prisma ORM
- MySQL

## Configuration

Le fichier `.env` contient:
- `DATABASE_URL` - URL de connexion MySQL
- `JWT_SECRET` - Secret pour les tokens JWT
- `NEXT_PUBLIC_SOCKET_URL` - URL du serveur Socket.IO (http://localhost:3001)
- `RESEND_API_KEY` - Clé API pour l'envoi d'emails
