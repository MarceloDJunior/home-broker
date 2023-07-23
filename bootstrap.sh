#!/bin/bash
echo "Starting all containers..."

docker-compose -f backend/docker-compose.yaml up -d
backend_result=$?

docker-compose -f broker-service/docker-compose.yaml up -d
broker_result=$?

if [ $backend_result -eq 0 ] && [ $broker_result -eq 0 ]; then
  echo "Containers started successfully!"
  echo "To start the broker microservice, cd into the broker-service folder and run: go run cmd/trade/main.go"
  echo 'To start the backend service, run: docker exec backend-app-1 bash -c "npm run dev"'
  echo 'To start the frontend app, cd into the frontend folder and run: "npm run dev"'
else
  echo "Failed to start containers."
fi