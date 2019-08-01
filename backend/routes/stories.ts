const express = require('express')
const router = express.Router();

const storyController = require('../controllers/storyController')

router.get('/', storyController.index)
router.post('/', storyController.create)
router.delete('/:id', storyController.delete)

module.exports = router
