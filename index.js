const {exit} = require('process');
const colors = require('colors');
const {config} = require("dotenv");
const neo4j = require('neo4j-driver');

require('dotenv').config();


(async () => {
    let driver = null;
    try {
        driver = neo4j.driver(
            process.env.NEO4J_URL,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
        )
        await driver.verifyConnectivity();
        console.log(`🧰 Driver is set up`.green);

        const session = driver.session({database: "neo4j"})

        console.log(`👑 Session started`.green);

        const cmd = process.argv.slice(2)[0];
        let exercice = null;
        try {
            exercice = require(`./exercices/${cmd}.js`);
            console.log(`🦊 Exercice ${cmd} found`.green);

        } catch (error) {
            console.error(`😭 Cannot find ${cmd}.js in exercices or ${cmd} contains errors`.white.bgRed.bold);
            console.debug(error);
            exit(100)
        }
        console.log(`🍣 Starting ${cmd}`.green);
        try {
            await exercice(session);
        } catch (error) {
            console.log(`😱 An error occured`.red.bold);
            console.log(error);
        } finally {
            console.log(`👋 Closing Session`.gray);
            await session.close()
        }
    } catch (error) {

        console.error(`😱 Something went wrong`.white.bgRed.bold);
        console.error(error);

    } finally {
        console.log(`👋 Closing Driver`.gray);
        await driver.close()
        exit(0);
    }


})();
