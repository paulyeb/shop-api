const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/', UsersController.index);
router.post('/', UsersController.create);
router.get('/:userId', UsersController.show);
router.delete('/:userId', UsersController.delete);

module.exports = router;