module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (t:Ticket) WHERE t.Cabin <> "null" RETURN t, count(t.Cabin) as total`)
    result.records.forEach(item => {
        console.log(`${item.get(0).labels[0]} ${item.get(0).properties.Libelle} : Nombre de cabine : ${item.get(1).low}`)
    });
    console.log(`Chaque ticket n'as pas réellement une cabine, en effet pour connaitre le vrai nombre, il aurait fallu faire une table cabine`.black.bgYellow)

    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}