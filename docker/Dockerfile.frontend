FROM node:18

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .

ENV VITE_APP_API_URL=https://localhost:5500
ENV VITE_APP_SOCKET_URL=https://localhost:5501

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "preview"]
