FROM buildkite/puppeteer:v1.15.0
WORKDIR /renderer
COPY package.json yarn.lock .yarnclean ./
RUN yarn install
COPY tsconfig.json .
COPY src/browser src/browser
COPY src/lib src/lib
RUN yarn build
ENTRYPOINT [ "node", "dist/browser/server.js" ]
