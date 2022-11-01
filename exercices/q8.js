module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (p:Passenger {Sex:"female"}) RETURN AVG(p.Age)`)
    const singleRecord = result.records[0];
    console.log(`L'age moyen des femmes sur le bateau est de ${singleRecord.get(0).toFixed(1)} ans `.black.bgYellow)

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}