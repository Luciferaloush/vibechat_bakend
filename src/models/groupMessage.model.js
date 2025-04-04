const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
          groupId: { 
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Group',
              required: true
          },
          senderId: { 
              type: mongoose.Schema.Types.ObjectId,
              ref: 'UsersVibechat', 
              required: true
          },
          content: { type: String, required: true },
          username: { type: String, required: true }, 
          createdAt: { type: Date, default: Date.now }
      });
      const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
      module.exports = { GroupMessage };