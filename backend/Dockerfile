FROM node:20-slim

WORKDIR /home/node/app

RUN npm install -g @nestjs/cli
RUN apt-get update && apt install -y openssl
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

USER node

# To keep container in execution
CMD ["tail", "-f", "/dev/null"]