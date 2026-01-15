ARG BASE_PATH=/usr/src/unleash

FROM node:24.12-slim AS builder
ARG BASE_PATH
WORKDIR ${BASE_PATH}

COPY package*.json ./
COPY common/package*.json ./common/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN --mount=type=cache,id=s/01fb8311-216c-463c-ab95-923f0a26b038-/root/.npm,target=/root/.npm npm ci

COPY . .
RUN npm run build --workspaces

FROM node:24.12-slim AS runtime
ARG BASE_PATH
WORKDIR ${BASE_PATH}

COPY --from=builder ${BASE_PATH}/common/package*.json ./common/
COPY --from=builder ${BASE_PATH}/common/build ./common/build

COPY --from=builder ${BASE_PATH}/server/package*.json ./server/
COPY --from=builder ${BASE_PATH}/server/build ./server/build
COPY --from=builder ${BASE_PATH}/server/resources ./server/resources

COPY --from=builder ${BASE_PATH}/client/dist ./client/dist

COPY --from=builder ${BASE_PATH}/package*.json ./

RUN npm ci --omit=dev -w server -w common

CMD [ "node", "server/build/index.js" ]
