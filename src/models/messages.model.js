const mongoose = require('mongoose');

// const messagesSchema = mongoose.Schema({
//           conversationId: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'Conversation',
//                 },
//                 senderId: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'UsersVibechat', 
//                 },
//                 message: {
//                     type: String,
//                     required: true,
//                 },
//                 timestamp: {
//                     type: Date,
//                     default: Date.now,
//                 },
//             });     
      

// const Messages = mongoose.model('Message', messagesSchema);
// module.exports = {Messages};
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
