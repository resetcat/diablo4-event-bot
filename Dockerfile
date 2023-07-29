# Stage 1 - the build process
FROM node:17-alpine3.14 as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

# Build the app
RUN yarn build

# Stage 2 - the production environment
FROM node:17-alpine3.14

WORKDIR /app

# copy from build image
COPY --from=builder /app .

# Install production dependencies
RUN yarn --production

EXPOSE 3000

CMD [ "node", "dist/main" ]
