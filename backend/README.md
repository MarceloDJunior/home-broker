# Home Broker Backend

The backend part of the Home Broker project, which is built using NestJS. The backend exposes REST API endpoints to create wallets, assets, and communicates with the broker-service through Kafka messages. It also communicates with the frontend through Server-Sent Events for real-time updates.

## Technologies Used

- **NestJS**: The backend is built entirely on NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB**: Used as the primary database for storing wallets, assets, and other data. It is run inside a Docker container and we create networks in Docker to allow communication between serv## Technologies Used

- **NestJS**: The backend is built entirely on NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB**: Used as the primary database for storing wallets, assets, and other data. MongoDB is run inside a Docker container and networks are created in Docker to allow communication between services.
- **Docker Compose**: Used to manage Node and MongoDB in an isolated environment.
- **Dev Container**: Allows running VS Code inside a container. It gives the feel of developing locally while actually running inside a container.
- **Rest Client Extension**: Used to test HTTP requests from VS Code. This allows testing endpoints directly inside VS Code.
- **Prisma Client and Prisma CLI**: Used for database schema migrations and data modeling.
- **Database Transactions and Concurrency Handling**: Ensures data consistency and integrity. Concurrency is handled using versions.
- **Kafka**: Used to publish and consume messages. Kafka allows communication with the broker-service via topic messages.
- **Server-Sent Events**: Allows real-time communication between the server and the client. Messages are pushed to the frontend using Server-Sent Events.
- **RxJS and MongoDB Watch**: Observables are created using RxJS and MongoDB Watch is used to detect database changes.
- **Nest Commander**: A module for NestJS to create command-line commands.

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository
2. Make sure Docker and Docker Compose are installed on your machine.
3. Run `docker-compose up` to start Node and MongoDB.
4. Run `docker exec -it home-broker-backend /bin/bash` to run commands inside the container.
4. Run the backend from inside the container using `npm run dev`.

## References

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Prisma](https://www.prisma.io/)
- [Apache Kafka](https://kafka.apache.org/)
- [RxJS](https://rxjs.dev/)