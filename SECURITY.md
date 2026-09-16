# ARCHITECTURE

HADES PWA is structured around a security-first app shell:

- app shell: Vite + React + TypeScript
- state and UX: HUD shell, system summaries, automation diagnostics panel
- policy: allowlist-based checks for tool access and scope validation
- offline: service worker with offline fallback
- PWA: manifest for standalone installation

The core intent is to preserve a real runtime architecture while keeping the first milestone safe and verifiable.
