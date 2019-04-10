const rootGetActions = require('../actions/root/rootGetActions')

exports.getHome = async () => {
    const resp = await rootGetActions.getHome()
    return resp
}
