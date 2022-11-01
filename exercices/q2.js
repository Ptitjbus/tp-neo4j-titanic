module.exports = async function (session) {
    
    const begin = performance.now()
    const result = await session.run(`MATCH (p:Passenger {Survived:false}) RETURN count(p)`)
    const singleRecord = result.records[0];
    console.log(`Nombre de décès : ${singleRecord.get(0).low}`.black.bgWhite);
    const result2 = await session.run(`MATCH (p:Passenger) WHERE p.Body IS NOT NULL RETURN count(p)`)
    const singleRecord2 = result2.records[0];
    console.log(`Nombre de corps retrouvés : ${singleRecord2.get(0).low}`.black.bgWhite);
    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}