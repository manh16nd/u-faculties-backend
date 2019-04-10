const express = require('express')
const router = express.Router()
const rootController = require('../controllers/root')

router.get('/', async (req, res) => {
        const resp = await rootController.getHome()
        res.send(resp)
    }
)

module.exports = router
