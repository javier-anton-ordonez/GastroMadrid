# GastroMadrid

Multi-site platform for connecting food buyers with local producers in Madrid.

## Architecture

- **apps/web** - Main informational website (gastromadrid.com)
- **apps/demo** - Public demo (demo.gastromadrid.com) 
- **apps/app** - Authenticated application (app.gastromadrid.com)
- **packages/ui** - Shared design system and components
- **services/api** - Go API backend (Gin)
- **services/analytics-runner** - Python analytics jobs
- **infra/** - Docker, Nginx, Prometheus, Grafana, Kubernetes configs

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

## Local URLs
- Main site: http://gastromadrid.localhost
- Demo: http://demo.gastromadrid.localhost
- App: http://app.gastromadrid.localhost
- API: http://api.gastromadrid.localhost
- Grafana: http://localhost:3001

## Development

```bash
npm install
npm run build
```

## Features
- Multi-site architecture with shared design system
- Custom authentication (email/password, HTTP-only cookies)
- Buyer and seller roles
- Product discovery with fuzzy search, categories, proximity-based ordering
- Madrid neighborhood statistics
- Analytics runners (Python)
- Observability (Prometheus/Grafana)
- Docker Compose and Kubernetes ready
