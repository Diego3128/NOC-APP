## NOP (network-operation-center)

> Check services like Apis, websites, databases, etc...

>  Get real time updates about their state. 


## Tech Stack

- `Nodejs`
- `Typescript`
- `Postgres`
- `Mongodb`
- `Docker`
- `Mongoose`
- `Prisma`

## Start the app

1- start depedencies 

```bash
npm install
```
2- create a `.env` file based on `.env.template` (don't rename the template file, create a new .env file)

```bash 
env.template -> .env
```

3- Start the docker containers

```bash
docker-compose up -d
```

4- start the app (development mode)

```bash
npm run dev
```

or build the production version

```bash
npm start
```