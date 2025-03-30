const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'ConversationVibechat',
          required: true
         },
    senderId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'UsersVibechat', 
         required: true
         },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MessagesVibechat = mongoose.model('MessagesVibechat', messageSchema);
 module.exports = {MessagesVibechat};
