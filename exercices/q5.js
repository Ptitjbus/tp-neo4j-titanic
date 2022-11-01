module.exports = async function (session) {
    
    const begin = performance.now()

    const resultH = await session.run(`MATCH (n:Passenger {Sex:"male"}) WHERE n.Age >= 18 AND n.Lifeboat IS NOT NULL RETURN count(n)`)
    const singleRecordH = resultH.records[0];
    console.log(`Nombres d'hommes majeurs qui ont eu un batteau de secours : ${singleRecordH.get(0)}`.black.bgWhite);

    const resultFE = await session.run(`MATCH (n:Passenger) WHERE (n.Sex = "female" AND n.Lifeboat <> "null") OR (n.Sex = "male" AND n.Age <= 18 AND n.Lifeboat <> "null") RETURN count(n)`)
    const singleRecordFE = resultFE.records[0];
    console.log(`Nombres de femmes et enfants qui ont eu un batteau de secours : ${singleRecordFE.get(0)}`.black.bgWhite);

    if(singleRecordH.get(0) > singleRecordFE.get(0)){
        console.log(`La phrase n'a pas été respectée car il y a eu plus d'hommes majeurs qui ont eu un canot de sauvetage`.black.bgWhite);
    }else{
        console.log(`La phrase a été respectée car il y a eu plus de femmes et d'enfants qui ont eu un canot de sauvetage`.black.bgWhite);
    }
    
    const end = performance.now()
    console.log(`Request took :  ${end - begin} ms.`.grey)

}