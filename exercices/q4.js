module.exports = async function (session) {
    
    const begin = performance.now()

    const result = await session.run(`MATCH (n:Passenger {Sex:"male"}) WHERE n.Age >= 18 RETURN count(n)`)
    const singleRecord = result.records[0];
    console.log(`Nombre de personnes qui ne sont pas concernés par "les femmes et les enfants d'abbord" (Les hommes de + de 18 ans) : ${singleRecord.get(0)}`.black.bgWhite);
    
    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}