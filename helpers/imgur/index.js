const imgur = require('imgur')

imgur.setClientId('2c6158375023d5c')

exports.uploadImgur = (file) => new Promise((resolve, reject) => {
    console.log('imgur')
    imgur.uploadFile(file)
        .then((json) => {
            return resolve(json.data.link)
        })
        .catch((err) => {
            return reject(err.message)
        })
})
