
const ObjectId = require('mongoose').Types.ObjectId



const isObjectId = (source) => {
    return ObjectId.isValid(source) ? source : null
}


console.log(isObjectId('5ccadf425eae2b04b01a76d5'))
