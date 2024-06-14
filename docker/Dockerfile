FROM debian:sid-slim

ENV THROW_AWAY=0005
ENV DEBIAN_FRONTEND=noninteractive

RUN set -ex && apt update --fix-missing && apt install -y libfile-slurp-perl libtext-multimarkdown-perl libmouse-perl libtext-xslate-perl libtry-tiny-perl libtest-fatal-perl libtest-requires-perl libxml-rss-perl cpanminus && rm -rf /var/lib/apt/lists/*
RUN cpanm Text::Handlebars

WORKDIR /app
