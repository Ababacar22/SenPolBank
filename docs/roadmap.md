# 🗺️ Roadmap — SenPolBank

## Méthodologie

Développement en **Agile SCRUM simplifié** : chaque sprint est livré, testé et documenté avant de passer au suivant.

---

## 🚀 Sprint 0 — Initialisation ✅

- [x] Structure monorepo
- [x] Docker Compose (PostgreSQL, Redis, MongoDB)
- [x] Documentation d'architecture
- [x] README principal

---

## 🔐 Sprint 1 — Authentification

- [ ] Auth Service (NestJS)
- [ ] JWT (access + refresh tokens)
- [ ] Login / Register endpoints
- [ ] Gestion des rôles (`citizen`, `police`, `bank`, `admin`)
- [ ] MFA (TOTP)
- [ ] Tests unitaires

---

## 👤 Sprint 2 — User Management

- [ ] User Service (CRUD profils)
- [ ] Attribution et modification des rôles
- [ ] Vérification d'identité simplifiée
- [ ] Tests unitaires

---

## 🚨 Sprint 3 — Fraud Reporting

- [ ] Fraud Service
- [ ] Création de signalement (API)
- [ ] Upload de pièces justificatives
- [ ] Suivi du statut (pending → validated → blocked)
- [ ] Tests unitaires et d'intégration

---

## 👮 Sprint 4 — Police Module

- [ ] Police Service
- [ ] Dashboard de validation des plaintes
- [ ] Bouton d'action critique (urgence)
- [ ] Historique des décisions
- [ ] Tests

---

## ⚡ Sprint 5 — Emergency Engine

- [ ] Orchestrateur d'urgence
- [ ] Event-driven (Redis Pub/Sub)
- [ ] Déclenchement automatique du blocage bancaire
- [ ] Gestion des timeouts et escalades
- [ ] Tests d'intégration

---

## 🏦 Sprint 6 — Bank Integration

- [ ] Bank Service
- [ ] Simulation d'API bancaire
- [ ] Blocage / déblocage de comptes
- [ ] Accusés de réception
- [ ] Tests

---

## 🔔 Sprint 7 — Notifications

- [ ] Notification Service
- [ ] Emails transactionnels
- [ ] WebSocket temps réel
- [ ] Templates de messages
- [ ] Tests

---

## 📊 Sprint 8 — Frontend

- [ ] Application React + Chakra UI
- [ ] Dashboard citoyen
- [ ] Dashboard police
- [ ] Dashboard banque
- [ ] Authentification frontend
- [ ] Tests E2E

---

## 🚀 Sprint 9 — DevOps

- [ ] Dockerfiles par service
- [ ] Configuration Kubernetes
- [ ] CI/CD GitHub Actions
- [ ] Monitoring et alerting

---

## 🤖 Sprint 10 — IA (optionnel)

- [ ] Module Python FastAPI
- [ ] Scoring des signalements
- [ ] Détection de patterns
- [ ] Intégration avec Fraud Service
