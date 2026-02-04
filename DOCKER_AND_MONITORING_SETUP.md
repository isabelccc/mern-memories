# Complete Docker and Monitoring Setup Guide

This guide provides step-by-step instructions for setting up Docker for the MERN stack application and configuring Prometheus + Grafana for monitoring.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Setup](#docker-setup)
3. [Prometheus & Grafana Setup](#prometheus--grafana-setup)
4. [Verification & Testing](#verification--testing)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Install Docker and Docker Compose

**macOS:**
```bash
# Install Docker Desktop (includes Docker Compose)
# Download from: https://www.docker.com/products/docker-desktop
# Or use Homebrew:
brew install --cask docker
```

**Linux:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Verify installation:**
```bash
docker --version
docker-compose --version
```

### 2. Create Environment File

Create a `.env` file in the project root:

```bash
cd /Users/linl/mern-memories
cp server/env.example .env  # If you have an example file
```

**Required environment variables** (create/edit `.env`):

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=memories

# API
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5001
NODE_ENV=production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id

# Frontend
REACT_APP_API_URL=http://localhost:5001
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Optional: Sentry for error tracking
SENTRY_DSN=
REACT_APP_SENTRY_DSN=
```

---

## Docker Setup

### Step 1: Understand the Docker Architecture

The application consists of three services:
- **PostgreSQL**: Database (port 5432)
- **API**: Backend Node.js/Express server (port 5001)
- **Client**: React frontend served by Nginx (port 3000 → 80 in container)

All services communicate via a Docker network called `app-network`.

### Step 2: Review Dockerfile Structure

#### Backend Dockerfile (`server/Dockerfile`)

**Multi-stage build:**
1. **Builder stage**: Installs dependencies, compiles TypeScript, generates Prisma client
2. **Production stage**: Only includes production dependencies and compiled code

**Key points:**
- Uses `node:18-alpine` for smaller image size
- Creates `dist/prisma/client.js` manually (TypeScript doesn't compile it automatically)
- Runs as non-root user for security
- Includes health check endpoint

#### Frontend Dockerfile (`client/Dockerfile`)

**Multi-stage build:**
1. **Builder stage**: Installs dependencies, builds React app
2. **Production stage**: Serves static files with Nginx

**Key points:**
- Uses `--legacy-peer-deps` to handle ESLint peer dependency conflicts
- Build-time environment variables (REACT_APP_*)
- Nginx serves the built React app
- Includes health check

### Step 3: Build Docker Images

**Build all services:**
```bash
cd /Users/linl/mern-memories
docker-compose build
```

**Build specific service:**
```bash
docker-compose build api      # Build only API
docker-compose build client   # Build only client
docker-compose build postgres # Pull PostgreSQL image (no build needed)
```

**Build with no cache (if you have issues):**
```bash
docker-compose build --no-cache
```

### Step 4: Start Services

**Start all services:**
```bash
docker-compose up -d
```

The `-d` flag runs containers in detached mode (background).

**Start specific service:**
```bash
docker-compose up -d postgres  # Start database first
docker-compose up -d api       # Then API
docker-compose up -d client    # Finally client
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f postgres
```

### Step 5: Run Database Migrations

**Option 1: Run migrations from host (if you have Prisma CLI installed):**
```bash
cd server
npx prisma migrate deploy
```

**Option 2: Run migrations inside API container:**
```bash
docker-compose exec api npx prisma migrate deploy
```

**Option 3: Run migrations manually:**
```bash
docker-compose exec api npx prisma db push
```

### Step 6: Verify Services Are Running

**Check container status:**
```bash
docker-compose ps
# or
docker ps
```

**Expected output:**
```
NAME                  STATUS          PORTS
mern-memories-db      Up (healthy)    0.0.0.0:5432->5432/tcp
mern-memories-api     Up (healthy)    0.0.0.0:5001->5001/tcp
mern-memories-client  Up (healthy)    0.0.0.0:3000->80/tcp
```

**Test endpoints:**
```bash
# API health check
curl http://localhost:5001/health

# API metrics (if Prometheus is configured)
curl http://localhost:5001/metrics

# Frontend
curl http://localhost:3000
```

### Step 7: Stop Services

**Stop all services:**
```bash
docker-compose down
```

**Stop and remove volumes (⚠️ deletes database data):**
```bash
docker-compose down -v
```

**Stop specific service:**
```bash
docker-compose stop api
```
---
## Prometheus & Grafana Setup

### Step 1: Understand the Monitoring Architecture

- **Prometheus**: Metrics collection and storage (port 9090)
- **Grafana**: Visualization and dashboards (port 3001)
- **Node Exporter**: System metrics (CPU, memory, disk) (port 9100)

Prometheus scrapes metrics from:
- The API (`/metrics` endpoint)
- Prometheus itself
- Node Exporter (system metrics)

### Step 2: Review Configuration Files

#### Prometheus Configuration (`monitoring/prometheus/prometheus.yml`)

**Key settings:**
- `scrape_interval: 15s` - How often to collect metrics
- `targets: ['mern-memories-api:5001']` - API service name in Docker network
- `metrics_path: '/metrics'` - Endpoint exposed by API

**Important:** The target uses the Docker service name (`mern-memories-api`), not `localhost`, because Prometheus runs in a container and needs to reach the API via Docker networking.

#### Grafana Configuration (`monitoring/grafana/provisioning/datasources/prometheus.yml`)

**Auto-configures:**
- Prometheus as default data source
- Connection URL: `http://prometheus:9090` (service name in Docker network)

### Step 3: Start Main Application First

**⚠️ CRITICAL:** Start the main application first to create the `app-network`:

```bash
cd /Users/linl/mern-memories
docker-compose up -d
```

**Verify network exists:**
```bash
docker network ls | grep app-network
# Should show: mern-memories_app-network
```

### Step 4: Start Monitoring Stack

**Navigate to monitoring directory:**
```bash
cd /Users/linl/mern-memories/monitoring
```

**Start Prometheus, Grafana, and Node Exporter:**
```bash
docker-compose up -d
```

**Verify containers are running:**
```bash
docker-compose ps
# or
docker ps | grep -E "prometheus|grafana|node-exporter"
```

**Expected output:**
```
prometheus      Up (healthy)    0.0.0.0:9090->9090/tcp
grafana         Up (healthy)    0.0.0.0:3001->3000/tcp
node-exporter  Up              0.0.0.0:9100->9100/tcp
```

### Step 5: Verify Prometheus Can Scrape API

**Check Prometheus targets:**
1. Open browser: http://localhost:9090
2. Go to **Status → Targets**
3. Verify `mern-memories-api` shows as **UP** (green)

**If target is DOWN:**
- Check API is running: `docker ps | grep mern-memories-api`
- Check API logs: `docker logs mern-memories-api`
- Verify network: `docker network inspect mern-memories_app-network`
- Test from Prometheus container: `docker exec prometheus wget -O- http://mern-memories-api:5001/metrics`

**Check metrics endpoint directly:**
```bash
# From host
curl http://localhost:5001/metrics | head -20

# From Prometheus container
docker exec prometheus wget -O- http://mern-memories-api:5001/metrics
```

### Step 6: Access Grafana

**Login:**
1. Open browser: http://localhost:3001
2. Username: `admin`
3. Password: `admin` (⚠️ Change this in production!)

**Verify Prometheus data source:**
1. Go to **Configuration → Data Sources**
2. Click **Prometheus**
3. Click **Test** - should show "Data source is working"

**View metrics:**
1. Go to **Explore** (compass icon)
2. Select **Prometheus** data source
3. Try queries:
   - `http_requests_total` - Total HTTP requests
   - `http_request_duration_seconds` - Request duration
   - `nodejs_heap_size_total_bytes` - Node.js heap size

### Step 7: Create Dashboards (Optional)

**Import pre-built dashboards:**
1. Go to **Dashboards → Import**
2. Use dashboard IDs:
   - **Node.js Exporter**: 1860
   - **Prometheus Stats**: 2
   - **Grafana Stats**: 2

**Or create custom dashboard:**
1. Go to **Dashboards → New Dashboard**
2. Add panels with queries like:
   - `rate(http_requests_total[5m])` - Requests per second
   - `histogram_quantile(0.95, http_request_duration_seconds_bucket)` - 95th percentile latency

### Step 8: Stop Monitoring Stack

**Stop monitoring services:**
```bash
cd /Users/linl/mern-memories/monitoring
docker-compose down
```

**Stop everything (app + monitoring):**
```bash
# From project root
cd /Users/linl/mern-memories
docker-compose down

cd monitoring
docker-compose down
```

---

## Verification & Testing

### Complete System Check

**1. Verify all containers are running:**
```bash
docker ps
```

**2. Test API:**
```bash
curl http://localhost:5001/health
# Should return: {"status":"ok","timestamp":"..."}
```

**3. Test Frontend:**
```bash
curl http://localhost:3000
# Should return HTML
```

**4. Test Prometheus:**
```bash
curl http://localhost:9090/-/healthy
# Should return: Prometheus is Healthy.
```

**5. Test Grafana:**
```bash
curl http://localhost:3001/api/health
# Should return JSON with status
```

**6. Verify metrics are being scraped:**
- Open http://localhost:9090/targets
- All targets should show **UP**

**7. Check Grafana dashboards:**
- Open http://localhost:3001
- Login and verify data is appearing

---

## Troubleshooting

### Issue: API Container Keeps Restarting

**Symptoms:**
```bash
docker ps
# Shows: mern-memories-api  Restarting (1) X seconds ago
```

**Diagnosis:**
```bash
docker logs mern-memories-api
```

**Common causes:**
1. **Missing Prisma client file:**
   - Error: `Cannot find module '/app/dist/prisma/client'`
   - Fix: Rebuild API container: `docker-compose build api`

2. **Database connection error:**
   - Error: `connect ECONNREFUSED`
   - Fix: Ensure postgres is running: `docker-compose up -d postgres`
   - Wait for health check: `docker-compose ps`

3. **Missing environment variables:**
   - Error: `DATABASE_URL is not defined`
   - Fix: Check `.env` file exists and has correct values

4. **Port already in use:**
   - Error: `EADDRINUSE: address already in use`
   - Fix: Stop conflicting service or change port in `docker-compose.yml`

### Issue: Prometheus Can't Scrape API

**Symptoms:**
- Prometheus target shows **DOWN**
- Error: `dial tcp: lookup mern-memories-api: no such host`

**Fixes:**

1. **Verify API is running:**
   ```bash
   docker ps | grep mern-memories-api
   ```

2. **Check network connectivity:**
   ```bash
   # List networks
   docker network ls
   
   # Inspect app-network
   docker network inspect mern-memories_app-network
   
   # Should show both prometheus and mern-memories-api containers
   ```

3. **Verify Prometheus is on the same network:**
   ```bash
   # Check monitoring/docker-compose.yml has:
   # networks:
   #   - app-network
   # And app-network is defined as external: true
   ```

4. **Test from Prometheus container:**
   ```bash
   docker exec prometheus wget -O- http://mern-memories-api:5001/metrics
   ```

5. **Check API metrics endpoint:**
   ```bash
   curl http://localhost:5001/metrics
   ```

### Issue: Frontend Can't Connect to API

**Symptoms:**
- Frontend loads but API calls fail
- Browser console shows: `Failed to fetch`

**Fixes:**

1. **Check API is running:**
   ```bash
   docker ps | grep mern-memories-api
   curl http://localhost:5001/health
   ```

2. **Verify REACT_APP_API_URL:**
   - Check `.env` file has: `REACT_APP_API_URL=http://localhost:5001`
   - Rebuild client: `docker-compose build client && docker-compose up -d client`

3. **Check CORS settings:**
   - Verify `CORS_ORIGIN` in `.env` matches frontend URL
   - Check API logs for CORS errors

### Issue: Database Connection Errors

**Symptoms:**
- API logs show: `PrismaClientInitializationError`
- Error: `Can't reach database server`

**Fixes:**

1. **Verify postgres is running:**
   ```bash
   docker ps | grep postgres
   docker-compose logs postgres
   ```

2. **Check DATABASE_URL:**
   ```bash
   # Should be: postgresql://postgres:postgres@postgres:5432/memories
   # Note: host is 'postgres' (service name), not 'localhost'
   ```

3. **Run migrations:**
   ```bash
   docker-compose exec api npx prisma migrate deploy
   ```

4. **Reset database (⚠️ deletes all data):**
   ```bash
   docker-compose down -v
   docker-compose up -d postgres
   # Wait for postgres to be healthy
   docker-compose exec api npx prisma migrate deploy
   ```

### Issue: Build Failures

**API build fails:**

1. **TypeScript errors:**
   ```bash
   # Check tsconfig.build.json is being used
   # Try building locally first:
   cd server
   npm run build
   ```

2. **Missing dependencies:**
   ```bash
   # Rebuild with no cache:
   docker-compose build --no-cache api
   ```

3. **Prisma client generation:**
   ```bash
   # Ensure prisma schema is copied before generate
   # Check Dockerfile order
   ```

**Client build fails:**

1. **Peer dependency conflicts:**
   - Already handled with `--legacy-peer-deps` in Dockerfile
   - If still failing, check `package.json` versions

2. **Environment variables:**
   - Ensure build args are passed in `docker-compose.yml`
   - Check `.env` file has correct values

### Issue: Port Conflicts

**Symptoms:**
- Error: `Bind for 0.0.0.0:5001 failed: port is already allocated`

**Fixes:**

1. **Find process using port:**
   ```bash
   # macOS/Linux
   lsof -i :5001
   # or
   netstat -an | grep 5001
   ```

2. **Stop conflicting service:**
   ```bash
   # If it's another Docker container:
   docker ps
   docker stop <container-id>
   
   # If it's a local process:
   kill -9 <PID>
   ```

3. **Change port in docker-compose.yml:**
   ```yaml
   ports:
     - "5002:5001"  # Use 5002 on host, 5001 in container
   ```

### Issue: Network Not Found

**Symptoms:**
- Error: `network app-network declared as external, but could not be found`

**Fixes:**

1. **Start main app first:**
   ```bash
   cd /Users/linl/mern-memories
   docker-compose up -d
   ```

2. **Verify network exists:**
   ```bash
   docker network ls | grep app-network
   ```

3. **Check network name:**
   - Docker Compose prefixes with project name
   - Default: `mern-memories_app-network`
   - Check `monitoring/docker-compose.yml` uses correct name

### General Debugging Commands

**View all logs:**
```bash
docker-compose logs -f
```

**Inspect container:**
```bash
docker exec -it mern-memories-api sh
```

**Check container resources:**
```bash
docker stats
```

**Remove everything and start fresh:**
```bash
docker-compose down -v
docker system prune -a  # ⚠️ Removes all unused images/containers
docker-compose build --no-cache
docker-compose up -d
```

---

## Quick Reference

### Start Everything
```bash
# 1. Start main app
cd /Users/linl/mern-memories
docker-compose up -d

# 2. Wait for app-network to be created
docker network ls | grep app-network

# 3. Start monitoring
cd monitoring
docker-compose up -d
```

### Stop Everything
```bash
# Stop monitoring
cd /Users/linl/mern-memories/monitoring
docker-compose down

# Stop main app
cd /Users/linl/mern-memories
docker-compose down
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose build api
docker-compose up -d api

# Rebuild all
docker-compose build
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f mern-memories-api
docker logs -f prometheus
```

### Access Services
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001
- **API Health**: http://localhost:5001/health
- **API Metrics**: http://localhost:5001/metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **Node Exporter**: http://localhost:9100/metrics

---

## Production Considerations

### Security

1. **Change default passwords:**
   - Grafana admin password
   - Database password
   - JWT secret

2. **Use secrets management:**
   - Docker secrets
   - Environment variable files (`.env` not in git)
   - Kubernetes secrets (if using K8s)

3. **Limit exposed ports:**
   - Only expose necessary ports
   - Use reverse proxy (Nginx/Traefik) for SSL termination

4. **Run as non-root:**
   - Already configured in Dockerfiles
   - Verify with: `docker exec mern-memories-api whoami`

### Performance

1. **Resource limits:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

2. **Database optimization:**
   - Connection pooling
   - Indexes on frequently queried fields
   - Regular VACUUM/ANALYZE

3. **Caching:**
   - Redis for session storage
   - CDN for static assets
   - Browser caching headers

### Monitoring

1. **Alerting:**
   - Configure Prometheus alert rules
   - Set up Alertmanager
   - Integrate with PagerDuty/Slack

2. **Logging:**
   - Centralized logging (ELK stack, Loki)
   - Structured logging (JSON format)
   - Log rotation

3. **Backup:**
   - Regular database backups
   - Volume snapshots
   - Disaster recovery plan

---

## GitHub Actions CI/CD Setup

### Overview

GitHub Actions provides automated testing, building, and deployment workflows. This section covers setting up CI/CD for your MERN stack application.

### Step 1: Create GitHub Actions Workflow Directory

```bash
mkdir -p .github/workflows
```

### Step 2: Create CI Workflow

Create `.github/workflows/ci.yml`:

```yaml


### Step 3: Create Deployment Workflow (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    name: Build and Push Docker Images
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for API
        id: meta-api
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push API image
        uses: docker/build-push-action@v5
        with:
          context: ./server
          file: ./server/Dockerfile
          push: true
          tags: ${{ steps.meta-api.outputs.tags }}
          labels: ${{ steps.meta-api.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Extract metadata for Client
        id: meta-client
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-client
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Client image
        uses: docker/build-push-action@v5
        with:
          context: ./client
          file: ./client/Dockerfile
          push: true
          tags: ${{ steps.meta-client.outputs.tags }}
          labels: ${{ steps.meta-client.outputs.labels }}
          build-args: |
            REACT_APP_API_URL=${{ secrets.REACT_APP_API_URL }}
            REACT_APP_GOOGLE_CLIENT_ID=${{ secrets.REACT_APP_GOOGLE_CLIENT_ID }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to production (example - customize for your infrastructure)
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://your-production-url.com

    steps:
      - name: Deploy to server
        run: |
          echo "Add your deployment commands here"
          # Examples:
          # - SSH into server and pull new images
          # - Update docker-compose.yml with new image tags
          # - Run docker-compose up -d
          # - Run database migrations
```

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → **Settings → Secrets and variables → Actions**

Add these secrets (if using deployment):

- `REACT_APP_API_URL`: Your production API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `DEPLOY_SSH_KEY`: SSH private key for server deployment (if deploying via SSH)
- `SERVER_HOST`: Production server hostname
- `SERVER_USER`: SSH username

### Step 5: Workflow Features Explained

**CI Workflow (`ci.yml`):**
- ✅ Runs on every push and pull request
- ✅ Tests backend with PostgreSQL service
- ✅ Tests frontend build
- ✅ Builds Docker images to verify they work
- ✅ Type checks TypeScript code
- ✅ Uploads test coverage (optional)

**Deploy Workflow (`deploy.yml`):**
- ✅ Builds and pushes Docker images to GitHub Container Registry
- ✅ Tags images with version, branch, and commit SHA
- ✅ Deploys to production on main branch pushes
- ✅ Uses GitHub Actions cache for faster builds

### Step 6: Test the Workflow

1. **Commit and push the workflow files:**
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions CI/CD workflows"
   git push origin main
   ```

2. **Check workflow status:**
   - Go to your GitHub repository
   - Click **Actions** tab
   - You should see the workflow running

3. **View workflow logs:**
   - Click on the running workflow
   - Click on individual jobs to see logs

### Step 7: Add Workflow Badge (Optional)

Add to your `README.md`:

```markdown
![CI](https://github.com/your-username/mern-memories/workflows/CI/badge.svg)
```

### Common Customizations

**Add linting step:**
```yaml
- name: Run ESLint
  working-directory: ./server
  run: npm run lint
```

**Add security scanning:**
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    scan-ref: './server'
```

**Add notification on failure:**
```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI failed!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

**Matrix testing (multiple Node versions):**
```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### Troubleshooting GitHub Actions

**Workflow not running:**
- Check file is in `.github/workflows/` directory
- Verify YAML syntax is correct
- Check branch name matches workflow trigger

**Tests failing:**
- Check database connection string
- Verify environment variables are set
- Check test timeout settings

**Docker build failing:**
- Verify Dockerfile paths are correct
- Check build context matches workflow
- Ensure all required files are in repository

**Permission errors:**
- Check repository settings allow GitHub Actions
- Verify secrets are correctly named
- Check workflow permissions in YAML

## Next Steps

1. **Set up CI/CD:**
   - ✅ GitHub Actions workflows created
   - Configure deployment targets
   - Set up staging environment

2. **Add more monitoring:**
   - Application logs (Loki)
   - Distributed tracing (Jaeger)
   - APM tools (New Relic, Datadog)

3. **Scale horizontally:**
   - Load balancer (Nginx/Traefik)
   - Multiple API instances
   - Database replication

4. **Improve security:**
   - SSL/TLS certificates (Let's Encrypt)
   - Rate limiting
   - WAF (Web Application Firewall)

---

## Summary

This guide covered:
- ✅ Docker setup for MERN stack
- ✅ Multi-stage builds for optimization
- ✅ Docker Compose orchestration
- ✅ Prometheus metrics collection
- ✅ Grafana visualization
- ✅ Network configuration
- ✅ Troubleshooting common issues

For questions or issues, refer to the troubleshooting section or check Docker/Prometheus/Grafana documentation.

