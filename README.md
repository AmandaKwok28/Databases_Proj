# Project Setup Instructions

## Prerequisites

### 1. Install Node.js

Download and install Node.js from the official website:
- Visit [https://nodejs.org/](https://nodejs.org/)
- Run the installer and follow the prompts

To verify Node.js is installed, open your terminal and run:
```bash
node --version
```

### 2. Install pnpm

Once Node.js is installed, install pnpm globally:
```bash
npm install -g pnpm
```

Verify pnpm is installed:
```bash
pnpm --version
```

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
cd web
pnpm install

cd api
pnpm install
```

### 3. Run the Frontend
```bash
cd web
pnpm dev
```

### 4. Run the Backend
If you choose to seed the database yourself, you will first need to set up a database using the Prisma Data Platform.

1. Create an account on the Prisma Data Platform and create a new PostgreSQL database.
2. Copy the provided database connection string (`DATABASE_URL`) from the Prisma dashboard.
3. In the backend root directory, create a `.env` file (if it does not already exist) and add:
   ```env
   DATABASE_URL="your_prisma_database_url_here"
   ```
Alternatively, we provide a valid .env file with a database url that is already seeded for convenience. We acknowledge that 
publishing database urls is not standard practice in industry but this url is posted for the purposes of this class project. Once
you have a seeded database, use the following commands to start the server.

```bash
cd api
pnpm start
```

The application should now be running. Open your browser and navigate to the URL shown in the terminal (`http://localhost:5173`).
