const express = require('express');
require('dotenv').config();
const { json } = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const errorHandler = require('./src/utils/error_handler');

const {Server} = require('socket.io');
const connectDB = require('./src/config/db');
const { saveMessage } = require('./src/controllers/message.controller');
const { getUsernameById } = require('./src/controllers/conversation.controller');
const { Group } = require('./src/models/groupe.model');
const { saveGroupMessage } = require('./src/controllers/group.controller');
const { Users } = require('./src/models/user.model');
const app = express();
// const cronJob = require('./src/cron/cron_job')
const server = http.createServer(app);
connectDB();

app.use(json());
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// async function updateMembersField() {
//     const groups = await Group.find({ 'members': { $type: 'objectId' } });
//     for (const group of groups) {
//         group.members = [group.members]; 
//         await group.save();
//     }
// }

// updateMembersField().then(() => console.log("Update completed")).catch(err => console.error(err));
app.use('/chat/v1/api/auth', require('./src/routes/auth.router'));
app.use('/chat/v1/api/conversation', require('./src/routes/conversations.router'));
app.use('/chat/v1/api/messages', require('./src/routes/message.router'));
app.use('/chat/v1/api/contact', require('./src/routes/contact.route'));
app.use('/chat/v1/api/group', require('./src/routes/group.router'));

io.on('connection', (socket) => {
    console.log(`A user connected ${socket.id}`);
    socket.on('joinConversation', (conversationId) => {
          socket.join(conversationId);
          console.log(`Joined conversation ${conversationId}`);
      })
      socket.on('sendMessage', async (message) => {
        const { conversationId, senderId, content } = message;
        console.log("Received message:", message);
        
        try {
            await saveMessage(conversationId, senderId, content);
            console.log("Message saved successfully.");
    
            const newMessageData = {
                conversationId,
                senderId,
                content,
                createdAt: new Date() 
            };
    
            const senderUsername = await getUsernameById(senderId);
            
            io.to(conversationId).emit("newMessage", newMessageData);
            io.emit("conversationUpdated", {
                conversationId,
                senderId,
                username: senderUsername,
                lastMessage: content, 
                createdAt: newMessageData.createdAt,
            });
        } catch (e) {
            console.log("Error in sendMessage:", e);
        }
    });

      socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Joined group ${groupId}`);
      });
      socket.on("sendGroupMessage", async (message) => {
        const { groupId, senderId, content } = message;
        console.log("Received group message:", message);
        try {
            const sender = await Users.findById(senderId);
            const username = sender ? sender.username : 'Unknown';
            const savedGroupMessage = await saveGroupMessage(groupId, senderId, content);
console.log(`savedGroupMessage ${savedGroupMessage}`);
            const formattedMessage = {
                groupId,       
                senderId,      
                content,       
                username,      
                createdAt: new Date().toString() 
            };

            console.log("Saved group message:", formattedMessage);
            io.to(groupId).emit("newGroupMessage", formattedMessage);
        } catch (e) {
            console.error("Error in sendGroupMessage:", e);
        }
    });
      socket.on('disconnect', () => {
          console.log(`User disconnected ${socket.id}`);
      }) 

});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});