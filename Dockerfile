FROM php:7.2-apache
COPY ./test04/ /var/www/html/
CMD sed -i "s/80/8080/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf && docker-php-entrypoint apache2-foreground
EXPOSE 8080
