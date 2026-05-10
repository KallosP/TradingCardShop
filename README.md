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

The values for the environment variables will be provided separately.

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
- The database is seeded with 8 demo users, each with 3 trading cards listed on the marketplace (24 cards total). All demo accounts use the password `password123`. Emails for each user can be found in `server/seed.js`
- Ensure `config.env` is correctly set or the backend will not start
- Docker Compose is configured to handle networking between services automatically

---

## Other

### Trello Board
https://trello.com/b/4q7MuICf/trading-card-shop

### ERD
<img width="478" height="698" alt="Screenshot 2026-05-10 113852" src="https://github.com/user-attachments/assets/be09bab3-9019-4110-955c-e85994777741" />



### Sequence Diagram
<img width="737" height="629" alt="Screenshot 2026-05-10 114757" src="https://github.com/user-attachments/assets/7bc5f285-4962-49f4-8df0-9eeff4206b71" />

