module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (p1:Passenger),(p2:Passenger {TicketLibelle:p1.TicketLibelle}) WHERE p1.Lifeboat<>p2.Lifeboat RETURN distinct p1`)
    result.records.forEach(item => {
        console.log(`${item.get(0).properties.Firstname} Canot : ${item.get(0).properties.Lifeboat}`)
    });

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}