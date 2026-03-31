# 🤝 Guide de Contribution — SenPolBank

Merci de contribuer à SenPolBank ! Voici les conventions à respecter.

## Prérequis

- Node.js ≥ 18
- Docker et Docker Compose
- Git

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Ababacar22/SenPolBank.git
cd SenPolBank

# 2. Copier les variables d'environnement
cp .env.example .env

# 3. Lancer les services d'infrastructure
docker compose up -d

# 4. Installer les dépendances (quand les services seront créés)
npm install
```

## Git Workflow

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Production stable |
| `develop` | Intégration |
| `sprint-N/feature-name` | Feature par sprint |
| `fix/description` | Correction de bug |

### Conventions de commits

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter l'endpoint de login
fix: corriger la validation du token JWT
docs: mettre à jour le README
test: ajouter les tests du auth service
refactor: extraire la logique de validation
chore: mettre à jour les dépendances
```

### Pull Requests

1. Créer une branche depuis `develop`
2. Implémenter la feature avec des commits propres
3. Écrire les tests
4. Mettre à jour la documentation
5. Ouvrir une PR vers `develop`
6. Attendre la review

## Structure du code

```
backend/
  <service-name>/
    src/
      modules/          # Modules NestJS
      common/           # Utilitaires partagés
      config/           # Configuration
    test/               # Tests
    package.json
    tsconfig.json
```

## Standards de code

- **TypeScript** strict mode
- **ESLint** + **Prettier** pour le formatage
- **Tests** obligatoires pour chaque feature
- **Documentation** Swagger pour chaque endpoint
