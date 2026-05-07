# This file is used to build a container image of the frontend

# Use node v22.17.0 as base image
FROM node:22.17.0  

# specifying the working directory
WORKDIR /app

# specifying what dependencies are used for the app (via packag.json)
# by copying package.json into current working dir (i.e. /app)
COPY package.json .

# install dependencies as you normally would when setting up a project
RUN npm install

# copy the complete source code from /client into /app
COPY . .

# the frontend runs on port 5173, so expose that port
EXPOSE 5173

# command to run the frontend ('-- --host' required to bind Vite to 
# accept connections from host machine, not just within docker container)
CMD ["npm", "run", "dev", "--", "--host"]