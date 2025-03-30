const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersVibechat', required: true },
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);
 module.exports = {Contact};
