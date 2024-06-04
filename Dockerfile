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
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443

RUN export SSL_CERTIFICATE
RUN export SSL_CERTIFICATE_KEY
RUN export SERVER_NAME

CMD ["EXPORT SSL_CERTIFICATE", "&&", "nginx", "-g", "daemon off;"]