FROM node:20-slim

WORKDIR /home/node/app

RUN npm install -g @nestjs/cli

USER node

# To keep container in execution
CMD ["tail", "-f", "/dev/null"]