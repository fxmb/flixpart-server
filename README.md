# Set up local database

## 1. Run postgres in a docker container locally

Execute:

`docker run -d --name flixpart-postgres -v flixpart_dbdata:/var/lib/postgresql/data -p 54320:5432 -e POSTGRES_PASSWORD=local postgres`

This does the following

1. Pull the docker image `postgres` if not available locally.
2. Run the image with:
   - the name `flixpart-postgres`
   - mount a volume (`-v`).
   - map the local port 54320 to the container port at 5432
   - parse `local` as password to the container. This will be used by postgres.

## 2. Create a database in the just created locally running postgres instance

`docker exec -it flixpart-postgres psql -U postgres -c "create database flixpart_server_db"`

This does the following

1. Execute a command into the postgres container we executed and started in the step above.
2. Run the command `CREATE DATABASE` to create our local database in the postgres container

## 3. Seed the postgres

Run `npm run seed`to load the data from `/data/seed.json` into your local postgres database for local development.

**!! If you run into an issue of duplicate entries (because you ran seed before, please check point 5. below) !!**

## 4. Start the local server

The local server is configured to look for a production connection string of postgres. Locally, this is not provided, hence it will use the provided local string:

```const DATABASE_URL = process.env.DATABASE_URL ||
  "postgres://postgres:local@localhost:54320/flixpart_server_db";
```

## 5. Repopulating the database with a fresh npm run seed

If you run into this error...
`driverError: error: duplicate key value violates unique constraint `
... it means that postgres already holds the data you want to upload. You need to delete the current tables by running the following commands:

1. `docker exec -it flixpart-postgres psql -U postgres -c "DROP DATABASE IF EXISTS flixpart_server_db"`

2. `docker exec -it flixpart-postgres psql -U postgres -c "CREATE DATABASE flixpart_server_db"`


**YOU NEED TO STOP THE SERVER BEFORE YOU EXECUTE ABOVE COMMAND**
