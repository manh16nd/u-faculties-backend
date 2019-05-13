const rootGetActions = require('../actions/root/rootActions')

exports.home = (req, res) => {
    res.send({
        success: 'true',
        data: 'pong'
    })
}

exports.fakeError = (req, res) => {
    throw new Error('123')
}

exports.getHome = async () => {
    return await rootGetActions.getHome()
}

exports.addAuthor = (req, res) => {
    const {name, student_code} = {...req.body}

    rootGetActions.addAuthor({name, student_code})
        .then(author => res.send({author}))
        .catch(err => res.send({
            err
        }))
}

exports.changeAuthor = (req, res) => {
    const {name, student_code, _id} = {...req.body}

    rootGetActions.changeAuthor({name, student_code, _id})
        .then(author => res.send({
            success: true,
            author
        }))
        .catch(err => {
            res.send({
                success: false,
                err: err.message,
            })
        })
}

exports.removeAuthor = (req, res) => {
    const {_id} = {...req.body}

    rootGetActions.removeAuthor(_id)
        .then(result => res.send({
            success: true,
            result,
        }))
        .catch(err => {
            res.send({
                success: false,
                err: err.message,
            })
        })
}
