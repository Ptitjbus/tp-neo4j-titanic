# TP Neo4J
Final code from [Mathis](https://github.com/Ptitjbus)

Fork from [Decima](https://github.com/henri-corp/tp-neo4j-js-skeleton)

## Requirements
- NodeJS


## Getting started

### Installation
Make a copy of `.env.sample` and name it `.env`.
Complete the .env with the right fields

Then run `yarn` or `npm install` depending on your environment.

The database is normally all set but if not, run : 
``` 
npm run start createNodes
```
Wait until the process is done before runnig :
```
npm run start createRelations
``` 


### Usage

Every responses should be stored in exercices folder.
To run them just run the following command : 

```
npm run start q1
```

If you have `yarn` you can run
```
yarn start q1
```
It will automatically use the file `./exercices/q1.js`.

## Clear database
To clear the database entierly just run

```
npm run start deleteAll
```
It will delete all the `nodes` and `relationships`
