# TradingCardShop
AVN Corp Technical Exercise

`docker build -t kallosp/tcs-frontend:1.0 .`

`docker run --network=tcs-network --name=frontend -p 5173:5173 kallosp/tcs-frontend:1.0`

`docker network create tcs-network`

`docker run --network=tcs-network --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:8.0-ubi8`

`docker run --network=tcs-network --name=backend -d -p 5050:5050 kallosp/tcs-backend:1.0`

`docker compose up`
`docker compose down`