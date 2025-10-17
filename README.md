# TBE API - Standalone Repository

A clean, standalone Next.js API application extracted from the TBE monorepo. This repository contains all the API endpoints, database models, and business logic needed for the TBE platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GCP
./scripts/deploy.sh
```

## 📁 Project Structure

```
src/
├── config/           # Environment and configuration
├── database/         # MongoDB models and queries
├── middleware/       # Auth, rate limiting, etc.
├── services/         # Email, external services
├── utils/            # Helper functions
└── pages/            # Next.js API routes
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm 9+
- MongoDB (local or cloud)
- Docker (for containerized builds)

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/tbe-api
NEXTAUTH_SECRET=your-secret-key
ADMIN_SECRET=your-admin-secret
OPENAI_API_KEY=your-openai-key
# ... other variables
```

3. Install dependencies and start development:
```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3004`

## 🐳 Docker

### Build and Run Locally

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Test Docker build (includes health check)
npm run docker:test
```

### Docker Configuration

- **Dockerfile**: `docker/Dockerfile` - Multi-stage optimized build
- **Dockerignore**: `docker/.dockerignore` - Minimal build context
- **Build context**: ~50MB (vs 6.1GB in monorepo)

## ☁️ GCP Deployment

### Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker installed

### Deploy

```bash
# Deploy to staging
./scripts/deploy.sh --staging

# Deploy to production
./scripts/deploy.sh --production

# Deploy to dev environment
./scripts/deploy.sh --manual
```

### What the deploy script does

✅ Sets up GCP resources (APIs, Artifact Registry)  
✅ Builds the application  
✅ Creates Docker image  
✅ Deploys to Cloud Run  
✅ Tests health endpoint  
✅ Opens deployed API in browser

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `ADMIN_SECRET` | Admin authentication secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API key | No |
| `CASHFREE_SECRET_KEY` | Cashfree payment secret | No |
| `EMAIL_API_KEY` | Email service API key | No |
| `SENTRY_AUTH_TOKEN` | Sentry authentication token | No |

### GCP Secret Manager

The following secrets are configured in GCP Secret Manager:
- `mongodb-uri`
- `nextauth-secret`
- `admin-secret`
- `openai-api-key`
- `youtube-api-key`
- `cashfree-secret-key`
- `email-api-key`
- `sentry-auth-token`

## 📡 API Endpoints

### Health & Status
- `GET /api/health` - Health check
- `GET /api/health/quizzes` - Quiz service health

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Core APIs
- `GET /api/v1/user` - User management
- `GET /api/v1/admin/users` - Admin panel
- `GET /api/v1/quiz` - Quiz management
- `GET /api/v1/prepyatra` - PrepYatra features
- `GET /api/v1/payment` - Payment processing

## 🏗️ Build Process

### Local Build
```bash
npm run build
```

### Docker Build
```bash
docker build -f docker/Dockerfile -t tbe-api .
```

### Cloud Build
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 📊 Performance

- **Build time**: ~2-3 minutes (vs hanging in monorepo)
- **Image size**: ~200MB (optimized multi-stage build)
- **Build context**: ~50MB (vs 6.1GB in monorepo)
- **Cold start**: ~2-3 seconds on Cloud Run

## 🔍 Monitoring

- **Health checks**: `/api/health` endpoint
- **Sentry**: Error tracking and performance monitoring
- **Cloud Run**: Built-in metrics and logging

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version (requires 20+)
2. **Docker build hangs**: Ensure Docker has enough memory
3. **Deployment fails**: Verify GCP credentials and project setup
4. **Health check fails**: Check environment variables and MongoDB connection

### Debug Commands

```bash
# Check local build
npm run build

# Test Docker build
npm run docker:test

# Check GCP project
gcloud config get-value project

# View Cloud Run logs
gcloud logs read --service=tbe-api-staging --limit=50
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |
| `npm run docker:test` | Test Docker build |
| `./scripts/deploy.sh` | Deploy to GCP |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and with Docker
5. Submit a pull request

## 📄 License

Private - TBE Platform

## 🆘 Support

- 🐛 Issues: Create GitHub issue
- 💬 Questions: Contact development team
- 📧 Email: [Your support email]
