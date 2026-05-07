# TradingCardShop
AVN Corp Technical Exercise

---

A full-stack web application for browsing and managing trading cards. The app is containerized using Docker and runs using Docker Compose.

---

## Prerequisites

You must have Docker Desktop installed.

Download: https://www.docker.com/products/docker-desktop/

Make sure Docker Desktop is running before continuing.

---

## Clone the Repo

Clone this repository with `git clone https://github.com/KallosP/TradingCardShop.git`.

---

## Environment Setup

Before running the app, create a file called `config.env` inside the `/server` directory.

Follow the structure of the `config.env.example` file that is included in `/server`.

---

## Run the Application

In the terminal, run the command `docker compose up` to:
- Start the frontend container
- Start the backend container
- Start the db container

---

## Stop the Application

To stop the app/all running containers, run: `docker compose down`

---

## Notes

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:5050 
- MongoDB runs on: http://localhost:27017 
- Ensure `config.env` is correctly set or the backend will not start
- Docker Compose is configured to handle networking between services automatically