const showdown  = require('showdown')
const converter = new showdown.Converter()

exports.convertMdToHtml = (text) => {
    return converter.makeHtml(text)
}
