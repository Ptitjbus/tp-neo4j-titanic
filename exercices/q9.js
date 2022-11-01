module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (t:Ticket) WHERE t.Fare IS NOT NULL RETURN AVG(t.Fare)`)
    const singleRecord = result.records[0];
    console.log(`Le prix moyen d'un ticket est ${singleRecord.get(0).toFixed(1)} `.black.bgYellow)

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}