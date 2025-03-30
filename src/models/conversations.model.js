const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participantOne: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    participantTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    createdAt: { type: Date, default: Date.now }
});
const ConversationVibechat = mongoose.model('ConversationVibechat', conversationSchema);
 module.exports = {ConversationVibechat};
