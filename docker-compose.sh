#!/bin/bash

set -e

command=$1

case "$command" in
    prod)
        echo "Running application in production mode..."
        docker compose -f ./docker/docker-compose.yml up --build
        ;;
    e2e)
        echo "Running application for e2e testing..."
        docker compose -f ./docker/docker-compose.e2e.yml up --build -d
        cd backend
        npm i
        npm run e2e
        ;;
    dev)
        echo "Running application for backend development..."
        docker compose -f ./docker/docker-compose.yml up database socket minio --build
        ;;
    *)
        echo "Invalid command. Use 'prod', 'e2e', 'dev'."
        exit 1
        ;;
esac
