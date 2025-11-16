# System Monitoring Dashboard

A real-time system monitoring dashboard for NVIDIA Spark, accessible via Tailscale VPN. This dashboard provides comprehensive visualization of system resources including CPU, Memory, Disk, Network, and GPU metrics.

## Features

- **Real-time Metrics**: Live system resource monitoring with 1-2 second update intervals
- **Visualization-Centric**: All metrics displayed with charts, graphs, and gauges
- **Process Management**: View, manage, and terminate processes (requires authentication)
- **Historical Data**: Access historical metrics and process history (requires authentication)
- **Authentication**: JWT-based authentication for protected endpoints
- **24/7 Availability**: Docker Compose setup with auto-restart policies

## Architecture

- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: FastAPI (Python) with real-time metrics collection
- **Database**: PostgreSQL for historical data storage
- **Reverse Proxy**: Nginx for serving frontend and proxying API requests
- **Deployment**: Docker Compose for easy setup and management

## Prerequisites

- Docker and Docker Compose installed
- Tailscale VPN configured on the server
- NVIDIA GPU drivers installed (for GPU metrics)

## Quick Start

1. **Clone and navigate to the project**:
   ```bash
   cd Exploration
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
   ```

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **Access the dashboard**:
   - Open your browser and navigate to `http://[tailscale-ip]`
   - The dashboard will be accessible from any device on your Tailscale network

## Configuration

### Environment Variables

**Backend** (`backend/.env`):
- `SECRET_KEY`: Secret key for JWT token generation
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Allowed CORS origins (use `*` for Tailscale network)
- `METRICS_COLLECTION_INTERVAL`: Interval in seconds for metrics collection (default: 2)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)

### Docker Compose

The `docker-compose.yml` file configures:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- Next.js frontend on port 3000
- Nginx reverse proxy on port 80

All services are configured with `restart: unless-stopped` for 24/7 availability.

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/v1/metrics/current` - Get current system metrics
- `GET /api/v1/metrics/cpu` - Get CPU metrics
- `GET /api/v1/metrics/memory` - Get memory metrics
- `GET /api/v1/metrics/disk` - Get disk metrics
- `GET /api/v1/metrics/network` - Get network metrics
- `GET /api/v1/metrics/gpu` - Get GPU metrics

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `GET /api/v1/auth/me` - Get current user info (requires auth)

### Protected Endpoints (Authentication Required)

- `GET /api/v1/processes/` - Get all running processes
- `POST /api/v1/processes/{pid}/kill` - Kill a process
- `POST /api/v1/processes/{pid}/priority` - Set process priority
- `GET /api/v1/history/metrics` - Get historical metrics
- `GET /api/v1/history/processes` - Get process history

## Usage

### Viewing Metrics

Simply visit the dashboard URL. All basic metrics are publicly viewable without authentication.

### Managing Processes

1. Navigate to `/login` and log in with your credentials
2. Access the processes page to view and manage running processes
3. You can kill processes or change their priorities (requires authentication)

### Viewing Historical Data

1. Log in to access historical data
2. Use the history endpoints to query past metrics and process information

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Services not starting

- Check Docker logs: `docker-compose logs [service-name]`
- Ensure ports 80, 3000, 8000, and 5432 are not in use
- Verify Docker and Docker Compose are running

### Cannot access via Tailscale

- Verify Tailscale is running on the server
- Check the Tailscale IP address: `tailscale ip`
- Ensure firewall allows connections on port 80
- Verify you're connected to the same Tailscale network

### GPU metrics not showing

- Ensure NVIDIA drivers are installed
- Verify `pynvml` can access GPU: `python -c "import pynvml; pynvml.nvmlInit()"`
- Check Docker has access to GPU (may require `--gpus all` flag)

## Security Considerations

- Change the default `SECRET_KEY` in production
- Configure `CORS_ORIGINS` to restrict access if needed
- Use strong passwords for database and user accounts
- Regularly update dependencies for security patches
- Consider using HTTPS with a reverse proxy for production

## License

This project is provided as-is for monitoring your NVIDIA Spark system.

