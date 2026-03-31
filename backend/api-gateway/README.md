# 🌐 API Gateway

Point d'entrée unique de la plateforme SenPolBank.

## Responsabilités

- Routage des requêtes vers les microservices
- Rate limiting et throttling
- Validation des tokens JWT
- Logging centralisé des requêtes
- CORS et sécurité HTTP

## Stack

- **Framework** : NestJS
- **Port** : 3000

## Sprint d'implémentation

Ce service sera initialisé dans le **Sprint 1** (Authentification).

## Flux

```
Client → API Gateway → [Auth | Fraud | Police | Bank | ...] Services
```
