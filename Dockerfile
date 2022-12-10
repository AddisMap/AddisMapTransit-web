FROM node:14-alpine AS builder

RUN apk add --no-cache ca-certificates git
COPY . /app
RUN cd /app && yarn && env YAML_CONFIG=/app/config.yml yarn build


FROM httpd:alpine as production

COPY --from=builder /app/dist /usr/local/apache2/htdocs
EXPOSE 80
