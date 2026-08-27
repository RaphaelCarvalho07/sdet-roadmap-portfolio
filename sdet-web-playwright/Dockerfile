# Step 1: Use an official Playwright image from Microsoft that already contains Node.js and all browser dependencies installed
FROM mcr.microsoft.com/playwright:v1.61.0-noble

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files first to leverage Docker caching for dependencies
COPY package*.json ./

# Step 4: Install only devDependencies (since our framework lives there) without interactive prompts
RUN npm ci

# Step 5: Copy the rest of the project files into the container
COPY . .

# Step 6: Define the default command to execute when the container starts
CMD ["npm", "test"]