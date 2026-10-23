# Architecture

## Overview
GastroMadrid is split into three independently deployable frontend applications sharing a common design system, with a Go API backend, MySQL database, Python analytics runners, and observability stack.

## Components
- Frontend apps (web, demo, app) built with React + Vite
- Shared packages for UI components, API client, auth
- Go API (Gin) with clean architecture
- MySQL for persistent data
- Python analytics runners for data aggregation
- Nginx for routing
- Prometheus/Grafana for monitoring
