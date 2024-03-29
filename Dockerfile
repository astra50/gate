FROM node:14.2.0-alpine as node-base

LABEL MAINTAINER="Konstantin Grachev <me@grachevko.ru>"

ENV APP_DIR=/usr/local/app
ENV PATH=${APP_DIR}/node_modules/.bin:${PATH}

WORKDIR ${APP_DIR}

RUN apk add --no-cache git

COPY package.json package-lock.json ${APP_DIR}/
RUN npm install --no-audit

FROM node-base as node

COPY webpack.config.js ${APP_DIR}
COPY postcss.config.js ${APP_DIR}
COPY .babelrc ${APP_DIR}
COPY assets ${APP_DIR}/assets

RUN NODE_ENV=production webpack

#
# PHP-FPM
#
FROM composer:2.3.2 as composer
FROM php:7.4.6-fpm-buster as php-base

LABEL MAINTAINER="Konstantin Grachev <me@grachevko.ru>"

ENV APP_DIR=/usr/local/app
ENV PATH=${APP_DIR}/bin:${APP_DIR}/vendor/bin:${PATH}

WORKDIR ${APP_DIR}

RUN set -ex \
    && apt-get update && apt-get install -y --no-install-recommends \
        git \
        openssh-client \
        libzip-dev \
        netcat \
        libmemcached-dev \
        unzip \
        libfcgi-bin \
        libpq-dev \
    && rm -r /var/lib/apt/lists/*

RUN set -ex \
    && docker-php-ext-install -j$(nproc) zip pdo_pgsql iconv opcache

RUN set -ex \
    && pecl install memcached apcu xdebug \
    && docker-php-ext-enable memcached apcu

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_MEMORY_LIMIT -1
COPY --from=composer /usr/bin/composer /usr/bin/composer

ENV WAIT_FOR_IT /usr/local/bin/wait-for-it.sh
RUN set -ex \
    && curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o ${WAIT_FOR_IT} \
    && chmod +x ${WAIT_FOR_IT}

COPY composer.json composer.lock ${APP_DIR}/
RUN set -ex \
    && composer validate \
    && composer install --no-interaction --no-progress --no-scripts

COPY etc/php.ini ${PHP_INI_DIR}/php.ini
COPY etc/php-fpm.conf /usr/local/etc/php-fpm.d/default.conf

ENV PHP_MEMORY_LIMIT 1G
ENV PHP_OPCACHE_ENABLE 1
ENV PHP_ZEND_ASSERTIONS 1

FROM php-base as php

ARG APP_ENV
ENV APP_ENV prod
ARG APP_DEBUG
ENV APP_DEBUG 0
ENV PHP_MEMORY_LIMIT 1G
ENV PHP_ZEND_ASSERTIONS -1

COPY bin bin
COPY config config
COPY public public
COPY src src
COPY templates templates
COPY translations translations
COPY --from=node /usr/local/app/public/manifest.json public/manifest.json

RUN set -ex \
    && composer install --no-interaction --no-progress --no-dev --classmap-authoritative \
    && console cache:warmup \
    && chown -R www-data:www-data ${APP_DIR}/var

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s \
        CMD REDIRECT_STATUS=true SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping REQUEST_METHOD=GET cgi-fcgi -bind -connect 127.0.0.1:9000

#
# nginx
#
FROM nginx:1.21.6-alpine as nginx-base

ENV PHP_FPM_HOST php-fpm

WORKDIR /usr/local/app/public

RUN apk add --no-cache gzip curl

FROM nginx-base AS nginx

ENV NGINX_ENTRYPOINT_QUIET_LOGS 1
ENV PHP_FPM_HOST 127.0.0.1

COPY --from=php /usr/local/app/public/favicon.ico favicon.ico
COPY --from=node /usr/local/app/public/assets assets
COPY --from=node /usr/local/app/public/img img
COPY --from=php /usr/local/app/public/robots.txt .

COPY etc/nginx.conf /etc/nginx/nginx.conf
COPY etc/nginx.default.conf /etc/nginx/templates/default.conf.template

RUN find . \
    -type f \
    \( \
        -name "*.css" \
        -or -name "*.eot" \
        -or -name "*.html" \
        -or -name "*.js" \
        -or -name "*.json" \
        -or -name "*.otf" \
        -or -name "*.svg" \
        -or -name "*.ttf" \
        -or -name "*.woff" \
     \) \
    -exec gzip -9 --name --suffix=.gz --keep {} \; \
    -exec echo Compressed: {} \;

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s CMD curl --fail http://127.0.0.1/healthcheck || exit 1
