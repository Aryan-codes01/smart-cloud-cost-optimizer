# System Design Notes

## Goal

Build a smart cloud cost optimizer that works as:

- A college mini project with mock billing uploads
- A serious cloud optimization dashboard with live billing adapters
- A future SaaS platform with role-based workflows and auto-actions

## High-Level Architecture

```text
React Dashboard
   |
   v
Express API Gateway
   |
   +--> Ingestion Service (CSV / JSON / live billing adapters)
   +--> Analytics Service (monthly cost, service split, top resources)
   +--> Recommendation Engine (idle, storage, rightsize, reserved, spot)
   +--> Forecast Service (next month estimation)
   +--> Action Service (approval flow, execution logs, auto-action mode)
   +--> Cloud Sync Service (AWS live adapter, Azure/GCP scaffold)
   |
   v
MongoDB
```

## Backend Modules

### 1. Ingestion Service

- Accepts CSV and JSON billing uploads
- Normalizes AWS, Azure, and GCP records into one internal model
- Supports `append` and `replace` import strategies

### 2. Analytics Service

- Aggregates monthly spend trends
- Computes service-wise and provider-wise cost breakdown
- Finds high-cost resources and Kubernetes cost hotspots

### 3. Recommendation Engine

- Idle compute detection
- Storage tier optimization
- Rightsizing recommendations
- Reserved-instance and spot-instance guidance
- Kubernetes requests/limits optimization hints

### 4. Forecast Service

- Uses recent monthly movement to forecast the next month
- Produces conservative, expected, and peak scenarios

### 5. Action Service

- Builds an approval queue from recommendations
- Allows Admin and DevOps roles to execute actions
- Logs execution for audit and demo visibility

### 6. Data Layer

- `BillingRecord` collection for normalized cloud billing and resource metrics
- `ActionLog` collection for execution history
- Memory fallback for zero-setup demo reliability

## Frontend Screens

- `Overview`: KPIs, trend chart, service split, upload panel, provider sync, readiness
- `Recommendations`: Searchable savings opportunities and next-month forecast
- `Action Center`: Auto-action queue and audit trail
- `Kubernetes`: Cluster and namespace cost efficiency
- `System Design`: Viva-friendly architecture explanation

## Why This Feels Product-Grade

- Role-based views for Admin, DevOps, and Finance
- Multi-cloud normalized schema
- Upload-first workflow for smooth demos
- Live AWS billing connector path for real integration
- Clear service separation for future SaaS scaling
