const _ = require('lodash')
const ObjectId = require('mongoose').Types.ObjectId

const isString = (source) => {
    return (_.isString(source)) ? source : null
}

const isNotNull = (source) => {
    return (_.isNil(source)) ? null : source
}

const isObjectId = (source) => {
    return ObjectId.isValid(source) ? source : null
}

const removeRedundant = (sourceObject) => {
    return _.pickBy(sourceObject, (value) => isNotNull(value))
}

exports.isString = isString
exports.isNotNull = isNotNull
exports.removeRedundant = removeRedundant
exports.isObjectId = isObjectId
