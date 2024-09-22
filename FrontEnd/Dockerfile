FROM node:20
WORKDIR /usr/src/app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the Angular app
RUN npm run build --prod

# Start the Angular app
CMD ["ng", "serve", "--host", "0.0.0.0"]