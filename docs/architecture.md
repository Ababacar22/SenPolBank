# 🏗️ Architecture — SenPolBank

## Vue d'ensemble

SenPolBank est une plateforme SaaS construite en **architecture microservices**. Chaque service est indépendant, déployable séparément, et communique via des API REST et des événements Redis Pub/Sub.

## Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Web App     │  │ Desktop App  │  │  API Externe (bank)  │  │
│  │  (React)     │  │ (Electron)   │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          └────────────┬────┘                     │
                       ▼                          │
              ┌────────────────┐                  │
              │  API Gateway   │◄─────────────────┘
              │   (NestJS)     │
              │   Port: 3000   │
              └───┬──┬──┬──┬──┘
    ┌─────────────┘  │  │  └──────────────────┐
    │    ┌───────────┘  └───────────┐         │
    ▼    ▼                         ▼         ▼
┌──────┐ ┌──────┐          ┌──────────┐ ┌──────────┐
│ Auth │ │ User │          │  Fraud   │ │  Police  │
│ Svc  │ │ Svc  │          │  Svc     │ │  Svc     │
└──┬───┘ └──┬───┘          └────┬─────┘ └────┬─────┘
   │        │                   │             │
   │        │                   └──────┬──────┘
   │        │                          ▼
   │        │                 ┌──────────────┐
   │        │                 │  Emergency   │
   │        │                 │  Engine      │
   │        │                 └──┬───────┬───┘
   │        │                    │       │
   │        │                    ▼       ▼
   │        │            ┌────────┐ ┌────────────┐
   │        │            │ Bank   │ │ Notif      │
   │        │            │ Svc    │ │ Svc        │
   │        │            └────────┘ └────────────┘
   │        │
   └────┬───┘
        ▼
  ┌──────────┐
  │  Audit   │
  │  Svc     │
  └──────────┘
```

## Flux principal : Signalement → Blocage

```
1. Citoyen ──→ [Fraud Service]     Crée un signalement de fraude
2.              [Fraud Service] ──→ [Police Service]  Transmet pour validation
3.              [Police Service] ──→ Validation / Rejet
4.              [Police Service] ──→ [Emergency Engine]  Si validé + urgent
5.              [Emergency Engine] ──→ [Bank Service]  Demande de blocage
6.              [Bank Service] ──→ Bloque le compte
7.              [Emergency Engine] ──→ [Notification Service]  Alerte toutes les parties
8.              [Audit Service]  ← Traçabilité à chaque étape
```

## Description des services

| Service | Rôle | Base de données | Port |
|---------|------|-----------------|------|
| **API Gateway** | Point d'entrée unique, routage, rate limiting | — | 3000 |
| **Auth Service** | Authentification JWT, MFA, gestion des sessions | PostgreSQL + Redis | 3001 |
| **User Service** | Gestion des profils et rôles | PostgreSQL | 3002 |
| **Fraud Service** | Création et suivi des signalements | PostgreSQL + MongoDB | 3003 |
| **Police Service** | Validation des plaintes, actions critiques | PostgreSQL | 3004 |
| **Emergency Engine** | Orchestration du flux d'urgence | Redis (Pub/Sub) | 3005 |
| **Bank Service** | Intégration bancaire, blocage de comptes | PostgreSQL | 3006 |
| **Notification Service** | Emails, WebSocket temps réel | Redis (queue) | 3007 |
| **Audit Service** | Logs immuables, traçabilité | MongoDB | 3008 |

## Communication inter-services

### Synchrone (REST)
- Client → API Gateway → Services
- API Gateway valide le JWT et route la requête

### Asynchrone (Redis Pub/Sub)
- Police Service → publie `fraud.validated`
- Emergency Engine → écoute `fraud.validated`, publie `bank.block_request`
- Bank Service → écoute `bank.block_request`
- Notification Service → écoute tous les événements critiques

## Sécurité

- **JWT** avec rotation de clés
- **MFA** (Time-based OTP)
- **Chiffrement** des données sensibles (AES-256)
- **Validation des entrées** (class-validator)
- **Rate limiting** au niveau gateway
- **Audit trail** sur chaque action critique
- **CORS** restrictif
- **HTTPS** obligatoire en production

## Bases de données

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   PostgreSQL    │     │    Redis     │     │   MongoDB    │
│                 │     │              │     │              │
│ • users         │     │ • sessions   │     │ • audit_logs │
│ • fraud_reports │     │ • token      │     │ • documents  │
│ • police_cases  │     │   blacklist  │     │ • attachments│
│ • bank_actions  │     │ • pub/sub    │     │              │
│ • roles         │     │   channels   │     │              │
└─────────────────┘     └──────────────┘     └──────────────┘
```
