FROM alpine:3.23

# Install necessary packages for development.
RUN apk update && apk add git gnupg openssh curl make bash nodejs

# Create a non-root user for development
RUN adduser -D dev
USER dev
WORKDIR /home/dev

ENV BUN_INSTALL=/home/dev/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

# Install Bun for the dev user so bun/bunx are available in interactive shells.
# Bun installer currently only places `bun`; add a `bunx` compatibility entrypoint.
RUN curl -fsSL https://bun.sh/install | bash \
	&& ln -sf "${BUN_INSTALL}/bin/bun" "${BUN_INSTALL}/bin/bunx"
