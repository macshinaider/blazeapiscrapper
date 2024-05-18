FROM node:18-bullseye

# Atualize e instale as dependências necessárias para o Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    libxss1 \
    libnss3 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0

# Informe ao Puppeteer para não baixar seu próprio Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Crie o diretório de trabalho
WORKDIR /app

# Copie os arquivos do projeto
COPY . .

# Instale as dependências do projeto
RUN npm install
ENV DATABASE_URL="mysql://root:Lucas102030@189.19.71.20:3306/blaze"

RUN npx puppeteer browsers install chrome

RUN npx prisma db push

# Crie um usuário não-root chamado 'appuser'
RUN sudo useradd -m appuser

# Altere a propriedade do diretório para o usuário não-root
RUN chown -R appuser:appuser /app

# Mude para o usuário não-root
USER appuser

# Exponha a porta que você deseja usar (por exemplo, 5050)
EXPOSE 5001

# Execute o seu aplicativo
CMD ["npm", "run", "start"]