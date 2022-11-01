module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (p:Passenger)-[]-(h:Hometown) RETURN h.Country, count(p) as total order by total desc`)
    result.records.forEach(item => {
        console.log(`${item.get(0)}, ${item.get(1)}`)
    });

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}