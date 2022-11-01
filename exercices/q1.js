module.exports = async function (session) {

    const begin = performance.now()
    const result = await session.run(`MATCH (n:Passenger) RETURN count(n)`)
    const singleRecord = result.records[0];
    console.log(`Nombre de Passagers du titanic : ${singleRecord.get(0).low}`.black.bgWhite);
    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}