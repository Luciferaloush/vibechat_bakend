// const mongoose = require('mongoose');

// const conversationsSchema = new mongoose.Schema({
//           participant_one: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'UsersVibechat', 
//                 },
//                 participant_two: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'UsersVibechat', 
//                 },
//     messages: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message',
//     }],
//     lastMessage: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message',
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now, 
//     },
// });

// const Converstions = mongoose.model('Conversation', conversationsSchema);
// module.exports = {Converstions};
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participantOne: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    participantTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    createdAt: { type: Date, default: Date.now }
});
const ConversationVibechat = mongoose.model('ConversationVibechat', conversationSchema);
 module.exports = {ConversationVibechat};
