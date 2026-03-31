# 🛡️ SenPolBank

> **Plateforme SaaS de communication sécurisée entre citoyens, police et banques pour bloquer les fraudes bancaires en temps réel.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/contributing.md)

---

## 🎯 Problème

Quand un citoyen est victime de fraude bancaire, le processus actuel est lent :
1. Se rendre au commissariat
2. Déposer plainte (papier)
3. La police contacte la banque (téléphone, fax, courrier)
4. La banque bloque le compte... souvent trop tard

**SenPolBank résout ce problème** en digitalisant et accélérant cette chaîne :

```
Citoyen signale → Police valide → Banque bloque → En temps réel
```

---

## 🏗️ Architecture

Architecture **microservices** avec 9 services indépendants :

```
                    ┌──────────────┐
                    │   Frontend   │
                    │  (React/CUI) │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ API Gateway  │
                    └──┬──┬──┬──┬──┘
         ┌─────────────┘  │  │  └─────────────┐
         ▼                ▼  ▼                ▼
  ┌──────────┐   ┌────────────┐   ┌───────────────┐
  │Auth Svc  │   │Fraud Svc   │   │Police Svc     │
  └──────────┘   └─────┬──────┘   └───────┬───────┘
                       │                  │
                ┌──────▼──────────────────▼──┐
                │     Emergency Engine       │
                └──────┬─────────────┬───────┘
                       ▼             ▼
                ┌──────────┐  ┌───────────┐
                │Bank Svc  │  │Notif Svc  │
                └──────────┘  └───────────┘
```

📖 [Documentation complète de l'architecture](docs/architecture.md)

---

## ⚙️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Backend** | NestJS, TypeScript |
| **Frontend** | React, Chakra UI |
| **Desktop** | Electron / Tauri |
| **BDD** | PostgreSQL, Redis, MongoDB |
| **DevOps** | Docker, Kubernetes, GitHub Actions |
| **IA** | Python, FastAPI (optionnel) |

---

## 📁 Structure du projet

```
senpolbank/
├── backend/
│   ├── api-gateway/          # Point d'entrée unique
│   ├── auth-service/         # Authentification JWT + MFA
│   ├── user-service/         # Gestion des profils
│   ├── fraud-service/        # Signalements de fraude
│   ├── police-service/       # Validation policière
│   ├── bank-service/         # Intégration bancaire
│   ├── emergency-engine/     # Orchestrateur d'urgence
│   ├── notification-service/ # Emails + WebSocket
│   └── audit-service/        # Traçabilité
├── frontend/
│   └── web-app/              # Application React
├── desktop/
│   └── electron-app/         # Application de bureau
├── ai/
│   └── fraud-detection/      # Module IA
├── infra/
│   ├── docker/               # Configuration Docker
│   └── kubernetes/           # Configuration K8s
├── docs/                     # Documentation
├── docker-compose.yml        # Services de dev
└── README.md
```

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) ≥ 18
- [Docker](https://docs.docker.com/get-docker/) et Docker Compose
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Ababacar22/SenPolBank.git
cd SenPolBank

# 2. Configurer l'environnement
cp .env.example .env
# Modifier les valeurs dans .env selon votre config

# 3. Lancer les services d'infrastructure
docker compose up -d

# 4. Vérifier que tout fonctionne
docker compose ps
```

### Services Docker

| Service | Port | Usage |
|---------|------|-------|
| PostgreSQL | 5432 | Base de données principale |
| Redis | 6379 | Cache et message broker |
| MongoDB | 27017 | Logs d'audit et documents |

---

## 🗺️ Roadmap

| Sprint | Objectif | Statut |
|--------|----------|--------|
| **Sprint 0** | Initialisation projet | ✅ Terminé |
| **Sprint 1** | Authentification (JWT, MFA) | 🔲 À venir |
| **Sprint 2** | Gestion utilisateurs | 🔲 À venir |
| **Sprint 3** | Signalement de fraude | 🔲 À venir |
| **Sprint 4** | Module police | 🔲 À venir |
| **Sprint 5** | Emergency Engine | 🔲 À venir |
| **Sprint 6** | Intégration bancaire | 🔲 À venir |
| **Sprint 7** | Notifications | 🔲 À venir |
| **Sprint 8** | Frontend | 🔲 À venir |
| **Sprint 9** | DevOps (Docker, K8s, CI/CD) | 🔲 À venir |
| **Sprint 10** | IA (optionnel) | 🔲 À venir |

📖 [Roadmap détaillée](docs/roadmap.md)

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Consultez le [guide de contribution](docs/contributing.md).

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).
