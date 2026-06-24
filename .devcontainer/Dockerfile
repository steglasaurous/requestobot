FROM mcr.microsoft.com/devcontainers/javascript-node:20

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    gettext-base \
    dos2unix \
    make \
    g++ \
    python3 \
    python3-setuptools \
    && rm -rf /var/lib/apt/lists/*
