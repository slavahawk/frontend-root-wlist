FROM certbot/certbot:latest

RUN apk add --no-cache bash dcron

CMD ["certbot", "--help"]
