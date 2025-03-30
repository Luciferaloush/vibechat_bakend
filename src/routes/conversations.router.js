const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const auth = require('../middleware/auth.middlewre');

router.get('/me', auth, conversationController.conversation);
router.post('/check-conv',auth ,conversationController.cheakOrCreateConversation);
module.exports = router;
