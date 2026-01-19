FROM node:alpine as builder

WORKDIR /app
COPY . /app
RUN npm install && npm run build:app

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /

EXPOSE 80

CMD ["/entrypoint.sh"]
