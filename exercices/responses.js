/**
 *
 * @param client Axios
 * @returns {Promise<void>}
 */
module.exports = async function (session) {
    // duplicate this file to add other exercices.
    const result = await session.run("CREATE (a:Person {firstname: 'Mathis'}) RETURN a")
    const singleRecord = result.records;
    console.log(singleRecord);
    console.log("🎉 Exercice 0 is a sample on how to create a new file ".black.bgGreen);

}