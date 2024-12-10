# Используем официальный образ Nginx как основу
FROM nginx:latest

# Устанавливаем Certbot и другие необходимые утилиты
RUN apt-get update && apt-get install -y \
    certbot \
    python3-certbot-nginx \
    cron && \
    rm -rf /var/lib/apt/lists/*

# Копируем статический Nginx конфиг
COPY nginx.template.conf /etc/nginx/nginx.template.conf

# Добавляем скрипт для генерации сертификатов
COPY init-letsencrypt.sh /init-letsencrypt.sh
RUN chmod +x /init-letsencrypt.sh

# Настраиваем запуск Nginx и обновление сертификатов
CMD ["/bin/bash", "-c", "/init-letsencrypt.sh && nginx -g 'daemon off;'"]
