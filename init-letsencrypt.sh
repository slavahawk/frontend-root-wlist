#!/bin/bash

set -e

DOMAINS=("${DOMAIN}" ${SUBDOMAINS//,/ })
EMAIL="your-email@example.com"
WEBROOT="/var/www/certbot"

# Создаем директории для сертификатов и веб-ресурсов
mkdir -p ${WEBROOT} /etc/letsencrypt/live/${DOMAIN}

# Проверяем наличие сертификатов
if [ ! -f /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ]; then
    echo "Сертификаты отсутствуют, создаём их с помощью Certbot"
    certbot certonly --webroot -w ${WEBROOT} \
        --email ${EMAIL} --agree-tos --no-eff-email \
        -d ${DOMAIN} $(for sub in "${DOMAINS[@]:1}"; do echo -n "-d ${sub} "; done)
fi

# Запускаем cron для автообновления сертификатов
echo "0 0,12 * * * certbot renew --webroot -w ${WEBROOT} && nginx -s reload" > /etc/cron.d/certbot
cron
