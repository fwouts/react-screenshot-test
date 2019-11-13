FROM buildkite/puppeteer:v1.15.0
WORKDIR /renderer
COPY package.json yarn.lock .yarnclean ./
RUN yarn install
COPY tsconfig.json .
COPY src src
RUN yarn build
ENTRYPOINT [ "node", "dist/lib/docker-entrypoint.js" ]
