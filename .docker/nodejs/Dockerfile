ARG NODEJS_VERSION

FROM node:${NODEJS_VERSION}-alpine AS base

FROM base AS development
RUN apk --update add build-base git openssh-client python3
