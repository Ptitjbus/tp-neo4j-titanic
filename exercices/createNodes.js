/**
 *
 * @param client Axios
 * @returns {Promise<void>}
 */
const csv = require("csvtojson");
const { json } = require("neo4j-driver-core");
var HometownTab = []
var DestinationTab = []
var TicketsTab = []
var counterForId = 0
module.exports = async function (session) {

    const jsonArray = await csv().fromFile("exercices/titanic_full.csv");

    //definition of fields type 
    const uselessFields = [
        'Age_wiki',
        'Class',
        'WikiId',
        'Name_wiki',
        'Boarded'
    ]

    const floatFields = [
        'Age',
        'Fare',        
        'PassengerId',
        'Pclass',
        'SibSp',
        'Parch',
    ]

    const stringFields =[
        'Sex',
        'Ticket',
        'Cabin',
        'Embarked',
        'Lifeboat',
        'Body'
    ]
    
    const boolFields = ['Survived']
    const nameFields = ['Name']

    //data sorting and creation of passengers nodes in neo4j
    const dPassenger = performance.now()
    console.log(`Creation of Passenger Nodes ...`.grey)
    for (const item of jsonArray) {
        counterForId++
            //useLessFields
            for (const field of uselessFields) {
                delete (item[field])
            }
            //null fields
            for (const field of Object.keys(item)) {
                if (!item[field]) {
                    item[field] = null
                }
            }
            //float fields
            for (const field of floatFields) {
                convertToFloat(item, field)
            }
            //float fields
            for (const field of stringFields) {
                nullChecker(item, field)
            }
            //name fields to firstname/lastname
            for (const field of nameFields) {
                convertToName(item, field)                
            }
            //bool fields
            for (const field of boolFields) {
                convertToBoolean(item, field)
            }

            //hometown
            let idHometown = convertToHometownField(item, 'Hometown')
                
            let idDestination = convertToDestinationField(item, 'Destination')

            setTicketTab(item,idDestination)
            
            // creation of passengers nodes
            let result = await session.run(`CREATE (p:Passenger {
                PassengerId:${item['PassengerId']},
                HometownId:${idHometown},
                TicketLibelle:${item['Ticket']},
                Survived:${item['Survived']},
                Lastname:${item['Name'][0]},
                Firstname:${item['Name'][1]},
                Age:${item['Age']},
                Sex:${item['Sex']},
                Sibsp:${item['SibSp']},
                Parch:${item['Parch']},
                Lifeboat:${item['Lifeboat']},
                Body:${item['Body']}}) RETURN p`)
    }
    const fPassenger = performance.now()
    console.log(`✔ Passenger Nodes succesfuly created in ${fPassenger - dPassenger} ms.`.black.bgGreen)

    //creation of hometowns nodes
    const dHometown = performance.now()
    console.log(`Creation of Hometown Nodes ...`.grey)
    for(const item of HometownTab){
        let result = await session.run(`CREATE (h:Hometown {
            HometownId:${item[0]},
            City:${item[1]},
            State:${item[2]},
            Country:${item[3]}}) RETURN h`)
    }
    const fHometown = performance.now()
    console.log(`✔ Hometown Nodes succesfuly created in ${fHometown - dHometown} ms.`.black.bgGreen)

    //creation of destinations nodes
    const dDestination = performance.now()
    console.log(`Creation of Destination Nodes ...`.grey)
    for(const item of DestinationTab){
        let result = await session.run(`CREATE (d:Destination {
            DestinationId:${item[0]},
            City:${item[1]},
            State:${item[2]},
            Country:${item[3]}}) RETURN d`)
    }
    const fDestination = performance.now()
    console.log(`✔ Destination Nodes succesfuly created in ${fDestination - dDestination} ms.`.black.bgGreen)

    //creation of tickets nodes
    const dTicket = performance.now()
    console.log(`Creation of Tickets Nodes ...`.grey)
    for(const item of TicketsTab){
        let result = await session.run(`CREATE (t:Ticket {
             Libelle:${item[0]},
             Fare:${item[1]},
             Cabin:${item[2]},
             Class:${item[3]},
             Embarked:${item[4]},
             DestinationId:${item[5]},
             PassengerId:${item[6]}}) RETURN t`)
    }
    const fTicket = performance.now()
    console.log(`✔ Ticket Nodes succesfuly created in ${fTicket - dTicket} ms.`.black.bgGreen)
    
}


//string to float
function convertToFloat(item, field) {
    if (!item[field]) {
        item[field] = null
        return
    }
    item[field] = parseFloat(item[field]);
}

//null checker
function nullChecker(item, field) {
    if (!item[field]) {
        item[field] = null
        return
    }
    item[field] = `"${item[field]}"`
}

//string to boolean
function convertToBoolean(item, field) {
    if (!item[field]) {
        item[field] = null
        return
    }
    if(parseInt(item[field])== 1)
        item[field] = true
    else
        item[field] = false
}

//string to firstname and lastname
function convertToName(item, field){
    if (!item[field]) {
        item[field] = null
        return
    }
    let name = item[field].replace(/"/g, '\\"')
    let ar = name.split(", ")
    for(let item of ar){
        ar[ar.indexOf(item)] = `"${item}"`
    }
    item[field] = ar
}

//string to hometown adress
function convertToHometownField(item, field){

    let adressTab = adressParsing(item, field)  
    if (!adressTab) {
        return null
    }  
    //test if hometown are differents and push them in an HometownTab array
    idOfAdress = counterForId
    if(HometownTab.length > 0){
        let isCityAlreadyCreated = false
        for(let item of HometownTab){
            isCityAlreadyCreated = false
            if(item.includes(adressTab[1]) && item.includes(adressTab[2]) && item.includes(adressTab[3])){
                isCityAlreadyCreated = true
                idOfAdress = item[0]
                break
            }                
        }
        if(!isCityAlreadyCreated){
            HometownTab.push(adressTab)
        }
    }else{
        HometownTab.push(adressTab)
    }

    return idOfAdress
}

//string to destination adress
function convertToDestinationField(item, field){

    let adressTab = adressParsing(item, field)    
    if (!adressTab) {
        return null
    }  
    //test if hometown are differents and push them in an DestinationTab array
    idOfAdress = counterForId
    if(DestinationTab.length > 0){
        let isCityAlreadyCreated = false
        for(let item of DestinationTab){
            isCityAlreadyCreated = false
            if(item.includes(adressTab[1]) && item.includes(adressTab[2]) && item.includes(adressTab[3])){
                isCityAlreadyCreated = true
                idOfAdress = item[0]
                break
            }                
        }
        if(!isCityAlreadyCreated){
            DestinationTab.push(adressTab)
        }
    }else{
        DestinationTab.push(adressTab)
    }

    return idOfAdress
}

//parse adress to convert in good format (id,city,state,county)
function adressParsing(item,field){

    let adressTab = []
    if (!item[field]) {
        item[field] = null
        return null
    }
    let ar = item[field].split(',')    

    if(ar[0] == 'New York City' || ar[0] == 'New York'){
        adressTab[0] = counterForId
        adressTab[1] = `"New York City"`
        adressTab[2] = `"New York"`
        adressTab[3] = `"US"`
    }
    else if(ar.length == 1){
        adressTab[0] = counterForId
        adressTab[1] = null
        adressTab[2] = null
        adressTab[3] = `"${ar[0]}"`
    }else if (ar.length == 2){
        adressTab[0] = counterForId
        adressTab[1] = `"${ar[0]}"`
        adressTab[2] = null
        adressTab[3] = `"${ar[1]}"`
    }else if (ar.length == 3){
        adressTab[0] = counterForId
        adressTab[1] = `"${ar[0]}"`
        adressTab[2] = `"${ar[1]}"`
        adressTab[3] = `"${ar[2]}"`
    }else if (ar.length == 4){
        adressTab[0] = counterForId
        adressTab[1] = `"${ar[0]}"`
        adressTab[2] = `"${ar[1]}"`
        if(ar[3].length == 2){
            adressTab[3] = `"${ar[2]}"`
        }else{
            adressTab[3] = `"${ar[3]}"`
        }
    }
    item[field] = adressTab
    return adressTab
}

//check if ticket exist and if not push ticket in TicketsTab 
function setTicketTab(item, idDestination){
    let ticketAr = []
    ticketAr[0] = item['Ticket']
    ticketAr[1] = item['Fare']
    ticketAr[2] = item['Cabin']
    ticketAr[3] = item['Pclass']
    ticketAr[4] = item['Embarked']
    ticketAr[5] = idDestination
    ticketAr[6] = item['PassengerId']
    

    if(TicketsTab.length > 0){
        let isTicketAlreadyCreated = false
        for(let item of TicketsTab){
            isTicketAlreadyCreated = false
            if(item.includes(ticketAr[0])){
                isTicketAlreadyCreated = true
                break
            }                
        }
        if(!isTicketAlreadyCreated){
            TicketsTab.push(ticketAr)
        }
    }else{
        TicketsTab.push(ticketAr)
    }
}
