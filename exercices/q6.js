module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (n:Passenger)-[]-(t:Ticket)-[]-(d:Destination) WHERE d.State CONTAINS "Washington" RETURN count(n)`)
    const singleRecord = result.records[0];
    console.log(`Nombre de personnes qui sont partis en direction de Washington DC : ${singleRecord.get(0).low}`.black.bgWhite);

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}