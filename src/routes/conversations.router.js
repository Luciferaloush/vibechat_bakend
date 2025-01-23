const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const auth = require('../middleware/auth.middlewre');

router.get('/me', auth, conversationController.conversation);

module.exports = router;
