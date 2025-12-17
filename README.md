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
```bash
cd api
pnpm start
```

The application should now be running. Open your browser and navigate to the URL shown in the terminal (`http://localhost:5173`).
