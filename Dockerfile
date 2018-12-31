FROM ubuntu

RUN mkdir -p /usr/src/evo
WORKDIR /usr/src/evo

COPY package.json /usr/src/evo
RUN apt update
RUN apt install -y curl gpg git
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt install -y supervisor nodejs redis-server build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm install

COPY ./src /usr/src/evo

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "supervisord" ]