const { Group } = require('../models/groupe.model');
const { GroupMessage } = require('../models/groupMessage.model');
const { Users } = require('../models/user.model');
const errorHandler = require('../utils/error_handler');
const mongoose = require('mongoose');

const create = errorHandler(async (req, res) => { 
          const { name } = req.body;
          const userId = req.user.id; 

          if(!name){
                    return res.status(404).json({
                              message: "Group name is required"
                    })
          }
          const group = new Group({
                    name,
                    creator: userId,
                    members: [userId]
          });
          await group.save();

          res.status(200).json({
                    message: "Create group successfully"
          })
});

const join = errorHandler(async (req, res) => { 
          const  {groupId}  = req.params;
          const userId = new mongoose.Types.ObjectId(req.user.id);
          console.log("User ID:", userId);

          const group = await Group.findById(groupId);
          if(!group){
                    return res.status(404).json({
                              message:"Group not found"
                    });
          }
          if(group.members.includes(userId)){
                    return res.status(200).json({
                              message: "Already a member"
                    })
          }
          console.log("Group ID:", groupId);
console.log("User ID:", userId);
console.log("Current Members:", group.members);
          group.members.push(userId);
          await group.save();
          res.status(200).json({
                    message: "Joined group success"
          })
});
const saveGroupMessage = errorHandler(async (groupId, senderId, content) => { 
        if (!groupId || !senderId || !content) {
                    console.log("Required information is missing"); 
                }
                const sender = await Users.findById(senderId); 
    const username = sender ? sender.username : 'Unknown'; 
                const newGroupMessage = new GroupMessage({
                    groupId,
                    senderId,
                    content,
                    username,
                    createdAt: new Date()
                }); 
                const savedMessage = await newGroupMessage.save();
                console.log("Message saved successfully:", savedMessage); 

        return savedMessage;           
 });
 const fetchAllGroupMessages = errorHandler(async (req, res) => {
    const groupId = req.params.groupId;
    if (!groupId) {
        return res.status(404).send({ message: 'No groupId' });
    }

    const messages = await GroupMessage.find({ groupId: groupId })
        .populate('senderId', 'username') 
        .exec();

    const formattedMessages = messages.map(message => ({
        _id: message._id,
        groupId: message.groupId,
        senderId: message.senderId._id, 
        content: message.content,
        username: message.senderId.username,
        createdAt: message.createdAt,
        __v: message.__v,
    }));

    res.status(200).send({ messages: formattedMessages });
});
const fetchUserGroups = errorHandler(async (req, res) => {
    const userId = req.user.id;

    const joinedGroups = await Group.find({ members: userId }).populate('members', 'username email');

    const result = await Promise.all(joinedGroups.map(
        async (group) => {
            const lastMessage = await GroupMessage.findOne({ groupId: group._id })
                .sort({ createdAt: -1 });

            return {
                ...group.toObject(), 
                lastMessage: lastMessage ? lastMessage.content : "start a new chat",
                createdAt: lastMessage ? lastMessage.createdAt : null 
            };
        }
    ));

    res.status(200).send({
        joinedGroups: result 
    });
});
    const allGroup = errorHandler(async (req, res) => {
        const userId = req.user.id;
        if (!userId) {
            return res.status(404).json({
                message: "user ID is required"
            });
        }
    
        const groups = await Group.find({}).populate('members', 'username email');
        if (!groups || groups.length === 0) {
            return res.json({
                message: "groups not found"
            });
        }
    const filterGroup = groups.filter(group => !group.members.some(
        member => member._id.equals(userId)));
        const formattedGroups = filterGroup.map(group => ({
            _id: group._id,
            name: group.name,
            creator: group.creator,
            members: group.members.map(member => ({
                id: member._id,
                username: member.username,
                email: member.email 
            })),
            __v: group.__v
        }));
    
        res.status(200).json({
            group: formattedGroups
        });
    });
module.exports = {
          create,
          join,
          saveGroupMessage,
          fetchAllGroupMessages,
          fetchUserGroups,
          allGroup
}