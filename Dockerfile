FROM buildkite/puppeteer:8.0.0
RUN apt-get -qqy update && \
    apt-get -qqy --no-install-recommends install \
    fonts-roboto \
    fonts-noto-cjk \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-kacst \
    fonts-freefont-ttf \
    fonts-thai-tlwg \
    fonts-indic && \
    apt-get -qyy clean
WORKDIR /renderer
COPY package.json yarn.lock .yarnclean ./
RUN yarn install
COPY tsconfig.json .
COPY src src
RUN yarn build
ENTRYPOINT [ "node", "dist/lib/docker-entrypoint.js" ]
