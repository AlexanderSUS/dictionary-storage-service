# dictionary-storage-api

Backend for dictionary-storage-client.
Rest API that allows to get word definitions and store words at the database.

### Installation and run

To run application you should have docker installed on your machine

**To run in development mode**

First install dependencies
```sh
npm install
```

Create empty .env file in the root of project and copy there content of env.example

Run db in docker container
```sh
docker compose up db -d
```

Run application with command
```sh
npm run start
```

