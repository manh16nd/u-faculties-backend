const express = require('express')
const router = express.Router()
const rootController = require('../controllers/root')

router.get('/', async (req, res) => {
        const resp = await rootController.getHome()
        res.send(resp)
    }
)

router.post('/', rootController.addAuthor)
router.patch('/', rootController.changeAuthor)
router.delete('/', rootController.removeAuthor)

module.exports = router
