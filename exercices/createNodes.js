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

    let dPassenger = performance.now()
    for (const item of jsonArray) {
        counterForId++
            for (const field of uselessFields) {
                delete (item[field])
            }
            for (const field of Object.keys(item)) {
                if (!item[field]) {
                    item[field] = null
                }
            }
            for (const field of floatFields) {
                convertToFloat(item, field)
            }
            for (const field of nameFields) {
                convertToName(item, field)                
            }
            for (const field of boolFields) {
                convertToBoolean(item, field)
            }
            let idHometown = convertToHometownField(item, 'Hometown')
            let idDestination = convertToDestinationField(item, 'Destination')

            setTicketTab(item,idDestination)
            
            let result = await session.run(`CREATE (p:Passenger {
                PassengerId:${item['PassengerId']},
                HometownId:${idHometown},
                TicketLibelle:"${item['Ticket']}",
                Survived:${item['Survived']},
                Lastname:"${item['Name'][0]}",
                Firstname:"${item['Name'][1]}",
                Age:${item['Age']},
                Sex:"${item['Sex']}",
                Sibsp:${item['SibSp']},
                Parch:${item['Parch']},
                Lifeboat:"${item['Lifeboat']}",
                Body:"${item['Body']}"}) RETURN p`)
    }
    let fPassenger = performance.now()
    console.log(`✔ Passenger Nodes succesfuly created in ${fPassenger - dPassenger} ms.`.black.bgGreen)

    let dHometown = performance.now()
    for(const item of HometownTab){
        let result = await session.run(`CREATE (h:Hometown {
            HometownId:${item[0]},
            City:"${item[1]}",
            State:"${item[2]}",
            Country:"${item[3]}"}) RETURN h`)
    }
    let fHometown = performance.now()
    console.log(`✔ Hometown Nodes succesfuly created in ${fHometown - dHometown} ms.`.black.bgGreen)

    let dDestination = performance.now()
    for(const item of DestinationTab){
        let result = await session.run(`CREATE (d:Destination {
            DestinationId:${item[0]},
            City:"${item[1]}",
            State:"${item[2]}",
            Country:"${item[3]}"}) RETURN d`)
    }
    let fDestination = performance.now()
    console.log(`✔ Destination Nodes succesfuly created in ${fDestination - dDestination} ms.`.black.bgGreen)

    let dTicket = performance.now()
    for(const item of TicketsTab){
        let result = await session.run(`CREATE (t:Ticket {
             Libelle:"${item[0]}",
             Fare:${item[1]},
             Cabin:"${item[2]}",
             Class:${item[3]},
             Embarked:"${item[4]}",
             DestinationId:${item[5]},
             PassengerId:${item[6]}}) RETURN t`)
    }
    let fTicket = performance.now()
    console.log(`✔ Ticket Nodes succesfuly created in ${fTicket - dTicket} ms.`.black.bgGreen)
    
}

function convertToFloat(item, field) {
    if (!item[field]) {
        item[field] = null
        return
    }
    item[field] = parseFloat(item[field]);
}

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

function convertToName(item, field){
    if (!item[field]) {
        item[field] = null
        return
    }
    let name = item[field].replace(/"/g, '\\"')
    let ar = name.split(", ")
    item[field] = ar
}

function convertToHometownField(item, field){
    //
    let adressTab = adressParsing(item, field)  
    if (!adressTab) {
        return null
    }  
    //test if hometown are differents and push them in an other array
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

function convertToDestinationField(item, field){
    //
    let adressTab = adressParsing(item, field)    
    if (!adressTab) {
        return null
    }  
    //test if hometown are differents and push them in an other array
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
