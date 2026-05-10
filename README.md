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

### ERD
<img width="279" height="610" alt="Screenshot 2026-05-10 084024" src="https://github.com/user-attachments/assets/83ca6da1-329a-4739-ab3f-a7854fbf5835" />

### Sequence Diagram
<img width="833" height="719" alt="Screenshot 2026-05-10 083939" src="https://github.com/user-attachments/assets/67dc49f4-0fc5-4a4d-893b-44e768835b7c" />

