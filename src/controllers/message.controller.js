const { ConversationVibechat } = require("../models/conversations.model");
const { MessagesVibechat } = require("../models/messages.model");
const errorHandler = require("../utils/error_handler");

const fetchAllMessagesByConversationId = errorHandler(async (req, res) => {
          const conversationId = req.params.conversationId;
          if(!conversationId){
                    return res.status(404).send({
                              message: 'No conversationId'
                    })
          }
          const conversation = await ConversationVibechat.findById(conversationId);
          if(!conversation){
                    return res.status(404).send({
                           message:"No Conversation"
                    });
          }
          const messages = await MessagesVibechat.find({ conversationId: conversationId });

    res.status(200).send({
        messages 
    });
          
})
const saveMessage = errorHandler(async (conversationId, senderId, content) => {
    if (!conversationId || !senderId || !content) {
        throw new Error("Required information is missing"); 
    }

    const newMessage = new MessagesVibechat({
        conversationId,
        senderId,
        content,
        createdAt: new Date() 
    });

    try {
        const savedMessage = await newMessage.save();
        console.log("Successfully saved message:", savedMessage); 
        return savedMessage; 
    } catch (error) {
        console.error("Error saving message in model:", error); 
        throw error; 
    }
});
module.exports = {
          fetchAllMessagesByConversationId,
          saveMessage,
}