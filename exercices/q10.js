module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (t:Ticket)-[]-(p:Passenger) RETURN distinct t as ticket,p.Lastname as nom_de_famille_associe`)
    result.records.forEach(item => {
        console.log(`${item.get(0).labels[0]} ${item.get(0).properties.Libelle} , ${item.get(1)}`)
    });

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}