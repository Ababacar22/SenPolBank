# ⚡ Emergency Engine

Moteur d'orchestration d'urgence de SenPolBank.

## Responsabilités

- Orchestration du flux d'urgence complet
- Déclenchement automatique du blocage bancaire après validation police
- Coordination entre Police Service et Bank Service
- Gestion des timeouts et escalades
- Notifications en temps réel à toutes les parties

## Stack

- **Framework** : NestJS
- **Message Broker** : Redis (Pub/Sub)

## Sprint d'implémentation

Ce service sera développé dans le **Sprint 5** (Emergency Engine).

## Flux

```
Police valide → Emergency Engine → Bank Service (blocage)
                                 → Notification Service (alertes)
                                 → Audit Service (traçabilité)
```
