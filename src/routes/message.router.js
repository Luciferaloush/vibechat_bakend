const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth.middlewre');

router.get('/getConvId/:conversationId', auth, messageController.fetchAllMessagesByConversationId);

module.exports = router;
