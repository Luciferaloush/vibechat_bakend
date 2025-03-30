const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const auth = require('../middleware/auth.middlewre');

router.post('/create', auth, groupController.create);
router.post('/join/:groupId', auth, groupController.join);
router.get('/:groupId/messages',auth ,groupController.fetchAllGroupMessages);
router.get('/my-groups', auth, groupController.fetchUserGroups); 
router.get('/all', auth, groupController.allGroup);

module.exports = router;