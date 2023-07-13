ARG NODEJS_VERSION

FROM node:${NODEJS_VERSION}-alpine AS base

FROM base AS development
RUN apk --update add git openssh-client
