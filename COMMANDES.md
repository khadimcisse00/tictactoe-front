# Commandes disponibles

## Installation

```bash
# Installer les dépendances Next.js
npm install

# Installer les dépendances du backend Socket.IO
npm run backend:install
```

## Développement

```bash
# Démarrer les deux serveurs en même temps (recommandé)
npm run dev-all

# Ou séparément:
npm run dev      # Serveur Next.js uniquement (port 3000)
npm run socket   # Serveur Socket.IO uniquement (port 3001)
```

## Production

```bash
# Build de l'application Next.js
npm run build

# Démarrer Next.js en mode production
npm start

# Démarrer le serveur Socket.IO
npm run socket
```

## Base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer/appliquer une migration
npm run prisma:migrate
```

## Emails

```bash
# Compiler les templates MJML en HTML
npm run mjml
```

## Autres

```bash
# Linter
npm run lint
```

## URLs importantes

- Application web: http://localhost:3000
- Serveur Socket.IO: http://localhost:3001
- Base de données: Configuration dans `.env` (DATABASE_URL)
