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
        docker compose -f ./docker/docker-compose.e2e.yml up --build
        ;;
    test)
        echo "Running application for backend testing..."
        docker compose -f ./docker/docker-compose.test.yml up --build
        ;;
    dev)
        echo "Running application for backend development..."
        docker compose -f ./docker/docker-compose.yml up database --build
        ;;
    *)
        echo "Invalid command. Use 'prod', 'e2e', 'test', 'dev'."
        exit 1
        ;;
esac
