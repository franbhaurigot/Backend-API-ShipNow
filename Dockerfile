FROM node:20-alpine

ENV NODE_ENV=production \
    UPLOAD_DIR=/app/uploads
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node src ./src
RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app

USER node
EXPOSE 3000

CMD ["npm", "start"]
