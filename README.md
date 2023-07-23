# Home Broker Project

This repository contains the complete Home Broker project, which is divided into three parts: a service, a backend, and a frontend. 

The service, written in Go, matches buying and selling orders to create transactions. 

The backend, built with NestJS, exposes endpoints to create wallets, assets, and communicates with the service and frontend. 

The frontend, built with Next.js 13, consumes the backend REST API and subscribes to server-sent events for real-time updates.

The project aims to simulate a stock trading platform where users can create wallets, place buying and selling orders for assets, and see real-time updates of their transactions. It's designed to mimic the operations of a real-world stock trading platform.

## Project Structure

- [**broker-service**](./broker-service/README.md): Contains the Go service that handles order matching logic.
- [**backend**](./backend/README.md): Contains the NestJS backend that exposes REST API endpoints and communicates with the service and frontend.
- [**frontend**](./frontend/README.md): Contains the Next.js frontend that consumes the backend REST API and subscribes to server-sent events.

Additionally, the repository includes two shell script files:

- **bootstrap.sh**: Starts all the necessary containers for the project.
- **terminate.sh**: Terminates all the running containers related to the project.

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository
2. Make sure Docker, Docker Compose, Node.js, and npm are installed on your machine.
3. Run `./bootstrap.sh` to start all the necessary containers.
4. Follow the additional steps shown in the console.

To terminate all the running containers related to the project, simply run `./terminate.sh`.
