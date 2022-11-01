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
    
    const boolFields = ['Survived']
    const nameFields = ['Name']

    //data sorting
    for (const item of jsonArray) {
        counterForId++
            //uselessFields
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
            //name fields to firstname/lastname
            for (const field of nameFields) {
                convertToName(item, field)                
            }
            //bool fields
            for (const field of boolFields) {
                convertToBoolean(item, field)
            }
            //set hometowns
            convertToHometownField(item, 'Hometown')
            //set destinations
            let idDestination = convertToDestinationField(item, 'Destination')
            //set tickets
            setTicketTab(item,idDestination)
    }

    //create relation between passengers and hometowns
    let dHometown = performance.now()
    for(const item of HometownTab){
            let result = await session.run(`MATCH
            (p:Passenger),
            (h:Hometown)
            WHERE p.HometownId = ${item[0]} AND h.HometownId = ${item[0]}
            CREATE (p)-[r:LIVEIN]->(h)
            RETURN type(r)`)
    }
    let fHometown = performance.now()
    console.log(`✔ Hometown/Passenger relation succesfuly created in ${fHometown - dHometown} ms.`.black.bgGreen)

    //create relation between tickets and destinations
    let dDestination = performance.now()
    for(const item of DestinationTab){
        let result = await session.run(`MATCH
            (t:Ticket),
            (d:Destination)
            WHERE d.DestinationId = ${item[0]} AND t.DestinationId = ${item[0]}
            CREATE (t)-[r:GOTO]->(d)
            RETURN type(r)`)
    }
    let fDestination = performance.now()
    console.log(`✔ Ticket/Destination relation succesfuly created in ${fDestination - dDestination} ms.`.black.bgGreen)

    //create relation between passengers and tickets
    let dTicket = performance.now()
    for(const item of TicketsTab){
        let result = await session.run(`MATCH
            (p:Passenger),
            (t:Ticket)
            WHERE p.TicketLibelle = "${item[0]}" AND t.Libelle = "${item[0]}"
            CREATE (p)-[r:OWNS]->(t)
            RETURN type(r)`)
    }
    let fTicket = performance.now()
    console.log(`✔ Passenger/Ticket relation succesfuly created in ${fTicket - dTicket} ms.`.black.bgGreen)
        
}

//string to float
function convertToFloat(item, field) {
    if (!item[field]) {
        item[field] = null
        return
    }
    item[field] = parseFloat(item[field]);
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
        adressTab[1] = 'New York City'
        adressTab[2] = 'New York'
        adressTab[3] = 'US'
    }
    else if(ar.length == 1){
        adressTab[0] = counterForId
        adressTab[1] = null
        adressTab[2] = null
        adressTab[3] = ar[0]
    }else if (ar.length == 2){
        adressTab[0] = counterForId
        adressTab[1] = ar[0]
        adressTab[2] = null
        adressTab[3] = ar[1]
    }else if (ar.length == 3){
        adressTab[0] = counterForId
        adressTab[1] = ar[0]
        adressTab[2] = ar[1]
        adressTab[3] = ar[2]
    }else if (ar.length == 4){
        adressTab[0] = counterForId
        adressTab[1] = ar[0]
        adressTab[2] = ar[1]
        if(ar[3].length == 2){
            adressTab[3] = ar[2]
        }else{
            adressTab[3] = ar[3]
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
