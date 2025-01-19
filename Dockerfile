FROM node:20 AS builder
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /usr/src/app
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gettext-base dos2unix make python3 g++
COPY apps apps
COPY libs libs
# NOTE: Including eslintrc as nx explodes without it with "Failed to process project graph."
COPY nx.json package.json package-lock.json tsconfig.base.json .eslintignore .eslintrc.json .prettierignore .prettierrc ./
RUN npm i
RUN npx nx build requestobot-server --prod --verbose

FROM node:20
WORKDIR /usr/src/app
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gettext-base dos2unix make python3 g++
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /usr/src/app/dist/apps/requestobot-server ./build
#COPY ./queuebot/run.sh /run.sh
EXPOSE 3000
ENTRYPOINT ["node", "build/main.js", "--serve"]
