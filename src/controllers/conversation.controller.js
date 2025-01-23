const { ConversationVibechat } = require("../models/conversations.model");
const { MessagesVibechat } = require("../models/messages.model");
const errorHandler = require("../utils/error_handler");

const conversation = errorHandler(async (req, res) => {
    const userId = req.user; 
    console.log("User ID:", userId); 

    const conversations = await ConversationVibechat.find({
        $or: [
            { participantOne: userId },
            { participantTwo: userId },
        ],
    })
    .populate('participantOne', 'username') 
    .populate('participantTwo', 'username');

    console.log("Conversations:", conversations);

    const result = await Promise.all(conversations.map(
        async (conversation) => {
            const lastMessage = 
            await MessagesVibechat.findOne({ conversationId: conversation._id }).
            sort({ createdAt: -1 });
            const otherParticipant = 
            conversation.participantOne._id.toString() === userId.toString()
                ? conversation.participantTwo
                : conversation.participantOne;
            return {
                conversationId: conversation._id.toString(),
                username: otherParticipant.username,
                lastMessage: lastMessage ? lastMessage.content : null, 
                createdAt: lastMessage ? lastMessage.createdAt : null 
            };
        }
    ));

    res.json(result);
});

module.exports = {
    conversation
};