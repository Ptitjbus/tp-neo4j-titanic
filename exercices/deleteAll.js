/**
 *
 * @param client Axios
 * @returns {Promise<void>}
 */
module.exports = async function (session) {
    const result = await session.run("MATCH (n) DETACH DELETE n")
    console.log("Toutes les données ont été supprimés !".white.bgRed);
}