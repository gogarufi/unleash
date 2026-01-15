Address Search service:

Deployed to Railway from GitHubwith Docker [play here](https://unleash-address-search.vercel.app/). Supports:
- logs search, filtering
- monitoring dashboard (CPU, memory, disk usage, network traffic)
- webhooks on events

# Project

This is a monorepo consisting of 3 packages:
  - client (React + Vite)
  - server (NodeJS + Express)
  - common (code shared between client and server)

The setup takes advantage of NPM workspaces and TypeScript references.

# Local Development

- In order to install dependencies for all the packages at once run (in root directory):

```
npm install
```

- In order to build all the packages at once run (in root directory):

```
npm run build --workspaces
```

- To start the service locally with HRM create `server/.env` based on `server/.env.example` and run (in root directory):

```
npm run start:dev -w server
npm run dev -w client
```

Client's Vite proxies all `/api` requests to the server's port and serves the frontend files only, whereas `ENVIRONMENT=local` in `server/.env`- makes the server only serve `api` endpoints, not the client's distributive. 

All modules also have `prettier` and `eslint` NPM scripts configured.

TODO: `husky` and `lint-staged` as well as centralised `eslint` and `vitest` configurations.

## Running Tests

To run Vitest intergation and unit tests for the server make sure to create `server/.env.test` based on `server/.env.example` and set `DATA_SOURCE=addresses.test.json` (this is our integration test data):

```
npm run test -w server
```

To run E2E cypress tests make sure that the port in `unleash/cypress.config.ts` is set to the same port as the client is running on, start server and client locally and then run (in root):

```
npm run test:cypress
```

which will execute Cypress E2E tests in CLI, in a headless browser.

TODO: Possibly component tests.


## Using Docker

To build a local docker image of the service run (in root):

```
docker build -f Dockerfile -t unleash:latest .
```

If you run it manually, don't forget to provide necessary environment variables.

To make it easier to spin up and down you can also use (in root):

```
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up
```

TODO: Adapt `watch` mode in docker compose to allow HMR.
