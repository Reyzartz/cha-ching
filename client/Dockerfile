FROM oven/bun:1.3.1-slim AS builder
WORKDIR /home/app/client

RUN groupadd app && useradd -g app app
RUN chown -R app:app /home/app
USER app

COPY --chown=app:app package.json bun.lockb .
RUN bunx expo install

COPY --chown=app:app . .
RUN chmod +x build.sh && ./build.sh


FROM nginx:alpine3.22
COPY --from=builder /home/app/client/dist /usr/share/nginx/html
EXPOSE 80

