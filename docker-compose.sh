#!/bin/bash

set -e

command=$1

wait_for_service() {
    local service_name=$1
    local port=$2
    echo "Waiting for $service_name to be ready on port $port..."
    ./scripts/wait-for-it.sh localhost:$port --timeout=60 --strict -- echo "$service_name is up."
}

install_dependencies() {
    echo "Installing dependencies in $1..."
    cd "$1"
    npm install
    cd - > /dev/null
}

case "$command" in
    prod)
        echo "Running application in production mode..."
        docker compose -f ./docker/docker-compose.yml up
        ;;
    test)
        echo "Running application for backend testing..."
        docker compose -f ./docker/docker-compose.test.yml up -d
        wait_for_service "Test database" 3307
        install_dependencies backend
        cd backend
        npm test
        ;;
    dev-backend)
        echo "Running application for backend development..."
        docker-compose -f ./docker/docker-compose.yml up -d database
        wait_for_service "Database" 3307
        install_dependencies backend
        cd backend
        npm run dev
        ;;
    dev-frontend)
        echo "Running application for frontend development..."
        docker-compose -f ./docker/docker-compose.yml up -d database backend
        wait_for_service "Backend" 5500
        install_dependencies frontend
        cd frontend
        npm run dev
        ;;
    *)
        echo "Invalid command. Use 'prod', 'test', 'dev-backend', 'dev-frontend'."
        exit 1
        ;;
esac
