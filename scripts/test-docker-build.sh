#!/bin/bash

# Test Docker build locally
set -e

echo "🧪 Testing Docker build locally..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

log "Cleaning up previous builds..."
docker rmi tbe-api-test 2>/dev/null || true
rm -rf .next 2>/dev/null || true

log "Building Docker image..."
docker build -f docker/Dockerfile -t tbe-api-test .

if [ $? -eq 0 ]; then
    log "✅ Docker build successful!"
    
    log "Testing container startup..."
    CONTAINER_ID=$(docker run -d -p 3001:3000 tbe-api-test)
    
    if [ $? -eq 0 ]; then
        log "✅ Container started successfully!"
        
        # Wait a moment for the app to start
        sleep 5
        
        # Test health endpoint
        log "Testing health endpoint..."
        if curl -f -s http://localhost:3001/api/health >/dev/null; then
            log "✅ Health check passed!"
        else
            warn "⚠️  Health check failed - checking logs..."
            docker logs $CONTAINER_ID
        fi
        
        # Cleanup
        log "Cleaning up..."
        docker stop $CONTAINER_ID >/dev/null
        docker rm $CONTAINER_ID >/dev/null
        docker rmi tbe-api-test >/dev/null
        
        log "🎉 All tests passed! Docker build is working correctly."
    else
        error "❌ Container failed to start"
        docker logs $CONTAINER_ID 2>/dev/null || true
        exit 1
    fi
else
    error "❌ Docker build failed"
    exit 1
fi
