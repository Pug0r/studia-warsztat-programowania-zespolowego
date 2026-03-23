FROM node:24-alpine

WORKDIR /usr/src/app

# 1. Copy package files and install EVERYTHING
COPY package*.json ./
RUN npm install

# 2. Copy all your project files (src, tsconfig, etc.)
COPY . .

# 4. Open the port
EXPOSE 5000

# 5. Start the app (Assumes your build output is in 'dist/index.js')
CMD ["npm", "run", "dev"]