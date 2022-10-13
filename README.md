# TP Neo4J
A base code for [Neo4J](https://decima.notion.site/Exercice-Neo4J-b9642c1647d24f62b5c69e680ddd141b)

## Requirements
- NodeJS
- Docker with Docker-compose


## Getting started

### Installation
make a copy of `.env.sample` and name it `.env`.
This file is by default configured to run with the docker-compose or local installation.

Then run `yarn` or `npm install` depending on your environment.

### Start Neo4J with Docker

Start Neo4J server using `docker-compose up -d`. Neo4J http port is `7474` and bolt is `7687`


### Usage

Every exercices should be stored in exercices folder.
To run them just run the following command : 

```
npm run start ex0
```

If you have `yarn` you can run
```
yarn start ex0
```
It will automatically use the file `./exercices/ex0.js`.

In the Exercices folder, you can find a `ex0.js`, a sample for you to create new exercices.

All exercices can be found on [learn.henri.run](https://decima.notion.site/Exercice-Neo4J-b9642c1647d24f62b5c69e680ddd141b)

