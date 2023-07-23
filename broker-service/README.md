# Home Broker Service

Service written in Go, part of the Home Broker project. This service is responsible for matching buying and selling orders to create transactions. It uses Kafka to publish and consume messages and sends the transactions to the backend app.

## Technologies Used

- **Go**: The service is written entirely in Go, leveraging its efficient concurrency model through goroutines and channels.
- **Kafka**: Used to publish and consume messages. It allows the service to process buying and selling orders efficiently.
- **Docker Compose**: Used to manage Kafka and its dependencies in an isolated environment.
- **Testing in Go**: We use Go's built-in testing package to write tests for our service.
- **Control Center**: Used to create topics and send messages in Kafka.
- **Zookeeper**: A necessary dependency to control Kafka partitions and decide which broker is the leader.
- **Transformer Pattern**: Applied for input and output processes to ensure data consistency and integrity.

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository
2. Make sure Docker and Docker Compose are installed on your machine.
3. Run `docker-compose up` to start Kafka and Zookeeper.
4. Run the service using `go run cmd/trade/main.go`.

## Running Tests

To run tests, use the `go test` command.

## Acknowledgements

- [Go](https://golang.org/)
- [Apache Kafka](https://kafka.apache.org/)
- [Docker Compose](https://docs.docker.com/compose/)
- [ZooKeeper](https://zookeeper.apache.org/)
