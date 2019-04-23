const rootGetActions = require('../actions/root/rootGetActions')
const typeValidators = require('../helpers/validators/typeValidators')

exports.getHome = async () => {
    const resp = await rootGetActions.getHome()
    return resp
}

exports.changeAuthors = (req, res) => {
    const author = {...req.body}
    const {name, _id, student_code} = author

    // Validate dữ liệu trước khi edit
    // const validatedAuthors = typeValidators.validate()

    // validate xong sẽ chuyển thành bên dưới, nhưng tôi chưa viết validate =))
    // rootGetActions.changeAuthors(validatedAuthors)
    rootGetActions.changeAuthors({name, _id, student_code})
        .then(author => res.send({
            author
        }))
        .catch(err => res.send(err))
}
