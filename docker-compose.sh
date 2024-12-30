#!/bin/bash

command=$1

if [ "$command" == "prod" ]; then
    echo "Running application in production mode..."
    docker compose -f docker-compose.yml up
elif [ "$command" == "test" ]; then
    echo "Running application for backend testing..."
    docker compose -f docker-compose.test.yml up
else
    echo "Invalid command. Use 'prod' or 'test'."
    exit 1
fi
