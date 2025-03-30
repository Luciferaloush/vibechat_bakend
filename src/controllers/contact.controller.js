const errorHandler = require('../utils/error_handler');
const {Contact} = require('../models/contact.model');
const {Users} = require('../models/user.model');
const fetchContacts = errorHandler(async (req, res) => {
         
              let userId = req.user ? req.user.id : null;
      
              if (!userId) {
                  return res.status(400).json({ message: "User ID is required." });
              }
      
              const contacts = await Contact.find({ userId: userId }).populate('contactId', 'username email');
      
              if (!contacts || contacts.length === 0) {
                  return res.status(404).json({ message: "No contacts found." });
              }
      
              res.status(200).json(contacts);
         
          });
          

          const addContact = errorHandler(async (req, res) => {
            let userId = req.user ? req.user.id : null;
        
            if (!userId) {
                return res.status(400).json({ message: "User ID is required." });
            }
        
            const { email } = req.body;
        
            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }
        
            const user = await Users.findOne({ email });
        
            if (!user) {
                return res.status(404).json({ message: "لا يوجد مستخدم بهذا البريد الإلكتروني." });
            }
        
            const existingContact = await Contact.findOne({ userId, contactId: user._id });
        
            if (existingContact) {
                return res.status(400).json({ message: "هذا الاتصال قد تم إضافته مسبقاً إلى جهة اتصالك." });
            }
        
            const newContact = new Contact({
                userId: userId,
                contactId: user._id, 
            });
        
            await newContact.save();
        
            res.status(200).json({
                message: "تم إضافة الاتصال بنجاح.",
                ...newContact._doc,
            });
        });
const recentContact = errorHandler(async (req, res) => {
    const userId = req.user ? req.user.id : null;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    const contacts = await Contact.find({userId: userId})
    .populate('contactId', 'username email profile_image')
        .sort({ createdAt: -1 }) 
        .limit(8);
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found." });
        }
        res.status(200).json(contacts);
});
module.exports = {
    fetchContacts,
    addContact,
    recentContact
};