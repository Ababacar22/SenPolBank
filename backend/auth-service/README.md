# 🔐 Auth Service

Service d'authentification et d'autorisation de SenPolBank.

## Responsabilités

- Inscription (register) et connexion (login)
- Génération et validation des tokens JWT
- Authentification multi-facteur (MFA)
- Gestion des rôles : `citizen`, `police`, `bank`, `admin`
- Refresh tokens et révocation de sessions

## Stack

- **Framework** : NestJS
- **Base de données** : PostgreSQL
- **Cache** : Redis (sessions, tokens blacklist)

## Sprint d'implémentation

Ce service sera développé dans le **Sprint 1** (Authentification).
