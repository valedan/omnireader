const express = require('express')
const router = express.Router();

const chapterController = require('../controllers/chapterController')

router.get('/:id', chapterController.show)
router.put('/:id', chapterController.update)

module.exports = router
