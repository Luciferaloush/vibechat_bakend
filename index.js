const express = require('express');
require('dotenv').config();
const { json } = require('body-parser');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const connectDB = require('./src/config/db');
const { saveMessage } = require('./src/controllers/message.controller');
const app = express();
const server = http.createServer(app);
connectDB();

app.use(json());
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


app.use('/chat/v1/api/auth', require('./src/routes/auth.router'));
app.use('/chat/v1/api/conversation', require('./src/routes/conversations.router'));
app.use('/chat/v1/api/messages', require('./src/routes/message.router'));

io.on('connection', (socket) => {
    console.log(`A user connected ${socket.id}`);

    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`Joined conversation ${conversationId}`);
    })

    socket.on('sendMessage', async(message) =>{
        const {conversationId, senderId, content} = message;

        try{
            const savedMessage = await saveMessage(conversationId, senderId, content);
            console.log("sendMessage: ");
            console.log(savedMessage);
            io.to(conversationId).emit("newMessage", savedMessage);
        }catch(e){
            console.log(e);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    })
})



app.get('/', 
    (req, res) => {
    console.log('test');
    res.send("yes it works");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});