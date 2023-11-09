# News Headlines API

## Features

- The Headlines API is a Node.js application built using the Express.js framework.
- It serves as a powerful and versatile server for managing news articles with full CRUD operations.
- TypeScript is used to ensure type safety, and TypeORM connects the application to a PostgreSQL database.
- Routes are used and a simple middleware added for logging request method, url, user-agent and etc.

## To use the API on your local machine

- Clone it and install necessary dependencies using npm install
- Configure your own enviroment by creating dotenv file and adding:
- PORT, HOST, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
- Create a database on PostgreSQL and add it to datasource.ts or let TypeORM to handle it
- Run the server with the command npm start
- Connect it to a client project of yours or test it with Postman
- Note: If you don't have an already existing databse please change the line synchronize: true on the datasource.ts
