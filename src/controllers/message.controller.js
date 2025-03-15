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
const saveMessage= errorHandler( async (convId, senderId, content) => {
          if(!convId || !senderId || !content){
                    throw new Error("المعلومات المطلوبة مفقودة");}
                    const newMessage = new MessagesVibechat({
                              conversationId: convId,
                              senderId: senderId,
                              content: content
                    });
                    const message = await newMessage.save();
                    return message;
})
module.exports = {
          fetchAllMessagesByConversationId,
          saveMessage,
}