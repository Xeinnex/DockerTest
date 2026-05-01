FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npx prisma migrate deploy && npm start -- -p 5000"]