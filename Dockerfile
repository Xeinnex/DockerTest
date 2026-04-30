FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

# This script extracts the hostname from your DATABASE_URL automatically
CMD ["sh", "-c", "DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||'); until nc -z $DB_HOST 5432; do echo \"Waiting for database at $DB_HOST...\"; sleep 2; done; npx prisma migrate deploy && npm start -- -p 5000"]