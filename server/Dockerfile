# This file is used to build a container image of the backend 

# Use node v22.17.0 as base image
FROM node:22.17.0  

# specifying the working directory
WORKDIR /app

# specifying what dependencies are used for the app (via packag.json)
# by copying package.json into current working dir (i.e. /app)
COPY package.json .

# install dependencies as you normally would when setting up a project
RUN npm install

# copy the complete source code from /server into /app
COPY . .

# the frontend runs on port 5050, so expose that port
EXPOSE 5050

# command to run the backend
CMD ["npm", "run", "dev"]