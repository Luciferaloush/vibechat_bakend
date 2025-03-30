const { ConversationVibechat } = require("../models/conversations.model");
const { MessagesVibechat } = require("../models/messages.model");
const { Users } = require("../models/user.model");
const errorHandler = require("../utils/error_handler");

const conversation = errorHandler(async (req, res) => {
    const userId = req.user.id; 
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

const cheakOrCreateConversation = errorHandler(async (req, res) => {
    const { userId } = req.body;
    const currentUserId = req.user ? req.user.id : null;

    if (!userId || !currentUserId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    if (currentUserId === userId) {
        return res.status(400).json({ message: "Cannot start a conversation with yourself." });
    }
    let conversation = await ConversationVibechat.findOne({
        $or: [
            { participantOne: currentUserId, participantTwo: userId },
            { participantOne: userId, participantTwo: currentUserId }
        ]
    });

    if (conversation) {
        return res.status(200).json({
            conversationId: conversation._id.toString(),
            participantOne: conversation.participantOne.toString(), // تأكد من تحويل إلى سلسلة نصية
            participantTwo: conversation.participantTwo.toString(),
            createdAt: conversation.createdAt,
            __v: conversation.__v
        });
    }

    conversation = new ConversationVibechat({
        participantOne: currentUserId,
        participantTwo: userId,
    });
    await conversation.save();

    res.status(201).json({
        conversationId: conversation._id.toString(),
        participantOne: conversation.participantOne.toString(),
        participantTwo: conversation.participantTwo.toString(),
        createdAt: conversation.createdAt,
        __v: conversation.__v
    });
});


const getUsernameById = async (userId) => {
    try {
        const user = await Users.findById(userId).select('username');
        return user ? user.username : null; 
    } catch (error) {
        console.error("Error fetching username:", error);
        return null;
    }
};
module.exports = {
    conversation,
    cheakOrCreateConversation,
    getUsernameById 
};