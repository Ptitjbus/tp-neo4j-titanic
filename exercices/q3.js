module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (n:Passenger {Survived:true})-[]-(t:Ticket) RETURN distinct t.Class, count(n) as total ORDER BY total desc`)
    const singleRecord = result.records[0];
    console.log(`Classe qui a le plus survécu  : Classe n°${singleRecord.get(0)}`.black.bgWhite);
    
    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}