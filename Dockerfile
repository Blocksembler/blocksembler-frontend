# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/custom_entrypoint.sh /custom_entrypoint.sh

RUN apk update
RUN apk add openssl

EXPOSE 80
EXPOSE 443

COPY docker/custom_entrypoint.sh /custom_entrypoint.sh
RUN chmod +x /custom_entrypoint.sh

ENTRYPOINT ["/custom_entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
