echo "Terminating all containers..."

docker-compose -f broker-service/docker-compose.yaml down
docker-compose -f backend/docker-compose.yaml down

echo "Containers terminated successfully!"
