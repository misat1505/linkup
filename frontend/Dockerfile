FROM node:14-alpine

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .

ENV HTTPS=true
ENV SSL_CRT_FILE=src/config/security/cert.crt
ENV SSL_KEY_FILE=src/config/security/key.pem
ENV REACT_APP_API_URL=https://localhost:5500
ENV REACT_APP_SOCKET_URL=https://localhost:5501

CMD ["npm", "start"]
