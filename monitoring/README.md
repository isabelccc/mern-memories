# Prometheus + Grafana Monitoring Setup

This directory contains the configuration files for Prometheus and Grafana monitoring.

## Quick Start

### 1. Install Prometheus Client in Your App

```bash
cd ../server
npm install prom-client
```

### 2. Add Metrics to Your App

The metrics utilities are already created:
- `server/utils/metrics.ts` - Metrics definitions
- `server/middleware/metrics.ts` - Metrics middleware

Just add to your `server/index.ts`:
```typescript
import { metricsHandler } from './utils/metrics.js';
import { metricsMiddleware } from './middleware/metrics.js';

// Add middleware
app.use(metricsMiddleware);

// Add metrics endpoint
app.get('/metrics', metricsHandler);
```

### 3. Start Monitoring Stack

```bash
cd monitoring
docker-compose up -d
```

### 4. Access Services

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin` (⚠️ change this!)

### 5. Verify Metrics

Check your app's metrics endpoint:
```bash
curl http://localhost:5001/metrics
```

Check Prometheus is scraping:
- Go to http://localhost:9090/targets
- Should show "mern-memories-api" as UP

## Directory Structure

```
monitoring/
├── docker-compose.yml          # Docker Compose configuration
├── prometheus/
│   ├── prometheus.yml          # Prometheus configuration
│   └── alert_rules.yml         # Alert rules
└── grafana/
    └── provisioning/
        └── datasources/
            └── prometheus.yml  # Grafana data source config
```

## Configuration

### Prometheus

Edit `prometheus/prometheus.yml` to:
- Change scrape intervals
- Add more scrape targets
- Configure retention

### Grafana

Edit `docker-compose.yml` to:
- Change admin password
- Configure additional settings

### Alerts

Edit `prometheus/alert_rules.yml` to:
- Add custom alerts
- Adjust thresholds
- Configure alert destinations

## Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f prometheus
docker-compose logs -f grafana

# Restart services
docker-compose restart

# Remove all data (fresh start)
docker-compose down -v
```

## Troubleshooting

### Prometheus can't scrape your app

1. Check your app is running: `curl http://localhost:5001/metrics`
2. Check Prometheus targets: http://localhost:9090/targets
3. If using Docker, use `host.docker.internal` instead of `localhost`
4. Check network connectivity

### Grafana can't connect to Prometheus

1. Check Prometheus is running: `docker ps`
2. Verify they're on same network (should be automatic)
3. Check Grafana data source config

### Metrics not appearing

1. Verify `/metrics` endpoint works
2. Check Prometheus is scraping (targets page)
3. Verify metric names in queries
4. Check time range in Grafana

## Next Steps

1. Create custom dashboards in Grafana
2. Set up alert notifications (email, Slack)
3. Add more custom metrics to your app
4. Configure longer data retention if needed

## Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
