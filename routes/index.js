const express = require('express')
const router = express.Router()
const rootController = require('../controllers/root')

router.get('/', async (req, res) => {
        const resp = await rootController.getHome()
        res.send(resp)
    }
)


// Từ giờ ta quy định
// GET để lấy dữ liệu
// PATCH để sửa
// POST để tạo mới
// DELETE để xóa
router.patch('/', rootController.changeAuthors)

module.exports = router
