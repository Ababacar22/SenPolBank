# 🐳 Infrastructure Docker

Configuration Docker pour le développement et le déploiement de SenPolBank.

## Services

| Service    | Image          | Port  |
|------------|----------------|-------|
| PostgreSQL | postgres:16    | 5432  |
| Redis      | redis:7-alpine | 6379  |
| MongoDB    | mongo:7        | 27017 |

## Utilisation

```bash
# Depuis la racine du projet
docker compose up -d

# Vérifier les services
docker compose ps

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down
```

## Sprint d'implémentation

Configuration avancée (Dockerfiles par service) dans le **Sprint 9** (DevOps).
