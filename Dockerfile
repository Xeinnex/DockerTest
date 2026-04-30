FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "until nc -z db 5432; do echo 'Waiting for database...'; sleep 2; done; npx prisma migrate deploy && npm start -- -p 5000"]