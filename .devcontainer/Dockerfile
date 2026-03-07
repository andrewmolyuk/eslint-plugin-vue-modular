FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install tools required by the project's Makefile/scripts and signed commit flow.
RUN apt-get update \
	&& export DEBIAN_FRONTEND=noninteractive \
	&& apt-get install -y --no-install-recommends \
		curl \
		make \
		gnupg2 \
	&& apt-get clean \
∏	&& rm -rf /var/lib/apt/lists/*

USER node

ENV BUN_INSTALL=/home/node/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

# Install Bun for the dev user so bun/bunx are available in interactive shells.
RUN curl -fsSL https://bun.sh/install | bash
