# Brainwave

**Brainwave** is a full-stack application built with Django (backend) and React with Redux (frontend). This README provides setup instructions for both local development and production environments.

## Table of Contents
- [Getting Started](#getting-started)
- [Running the Project Locally](#running-the-project-locally)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project in Production](#running-the-project-in-production)


## Getting Started
Clone the repository to get started with the **Brainwave** project.

```bash
git clone https://github.com/martin-joshy/Brainwave.git
cd Brainwave
```

---

## Running the Project Locally

This section provides instructions for setting up the development environment for both the backend and frontend of the project.

### Backend Setup
1. **Navigate to the backend directory:**
   ```bash
   cd backend/brainwave_backend
   ```

2. **Configure Environment Variables:**
   - Create an `.env` file in this directory based on the provided `env_example/.env.development.example`.

3. **Set up Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```
   The backend server should now be running on `http://127.0.0.1:8000`.

---

### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend/brainwave_frontend
   ```

2. **Configure Environment Variables:**
   - Create an `.env` file based on the `.env.example` file in this directory.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Frontend Server:**
   ```bash
   npm run dev
   ```
   The frontend should now be running, typically accessible at `http://localhost:5173`.

---

## Running the Project in Production

To run the project in a production environment, you can use Docker with the `docker-compose.prod.yml` file provided in the `docker_compose` directory.

1. **Set up Production Environment Variables:**
   - create a `.env` file based on your production settings given in `backend/brainwave_backend/env_example/.env.production.example`.

2. **Run Docker Compose:**
   ```bash
   docker-compose -f docker_compose/docker-compose.prod.yml up -d
   ```
   This command will start the backend, frontend, and database services configured for production.

---
