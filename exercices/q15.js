module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (d:Destination)-[]-(t:Ticket)-[]-(p:Passenger)-[]-(h:Hometown) WHERE d.Country = h.Country AND d.City = h.City AND d.State = h.State RETURN distinct d`)
    result.records.forEach(item => {
        console.log(`${item.get(0).properties.City}`)
    });

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}