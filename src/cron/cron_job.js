// const cron = require('node-cron');
// const { ConversationVibechat } = require('../models/conversations.model');
// const generateDailyQuestion = require('../services/openai.services');
// const { MessagesVibechat } = require('../models/messages.model');

// cron.schedule('* * * * *', async () => {
//     try {
//         const conversations = await ConversationVibechat.find({});
//         for (const conversation of conversations) {
//             const question = await generateDailyQuestion();

//             const message = new MessagesVibechat({
//                 conversationId: conversation._id,
//                 senderId: conversation.participantOne, 
//                 content: question,
//             });
// console.log(`Daily question sent of conversation ${conversation.id}`);
//             await message.save(); 
//         }
//     } catch (e) {
//         console.error("Error saving daily question:", e);
//     }
// });