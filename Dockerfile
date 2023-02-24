# Imagem do container
FROM node:16.16.0
# Enviroment variable
ENV WORKDIR=/prisma
# Indica qual é o diretório de trabalho
WORKDIR ${WORKDIR}
# Copia todos os arquivos para o workdir
COPY . .
RUN npm ci
RUN npm install -g nodemon
RUN npm install tsup
RUN npm install tsx

# CMD ["npm", "start"]