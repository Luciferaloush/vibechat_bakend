require('dotenv').config(); // تحميل المتغيرات البيئية
const connectDB = require('./src/config/db');
const { Converstions } = require('./src/models/conversations.model');
const { Messages } = require('./src/models/messages.model');
const mongoose = require('mongoose');

const addMessage = async () => {
    await connectDB(); // الاتصال بقاعدة البيانات

    const conversationId = '679170954e5b0d63f78b12fe'; // استخدم قيمة conversationId المناسبة
    const senderId = '67916eef9430fc2583ff78b4'; // استخدم قيمة senderId المناسبة
    const messageContent = 'Hello, this is an automated message!'; // نص الرسالة

    const newMessage = new Messages({
        conversationId,
        senderId,
        message: messageContent,
        timestamp: new Date(),
    });

    try {
        const savedMessage = await newMessage.save(); // حفظ الرسالة الجديدة

        // تحديث المحادثة لتعيين lastMessage إلى كائن الرسالة
        await Converstions.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: savedMessage, // تعيين lastMessage إلى ID الرسالة الجديدة
                updatedAt: new Date(), // تحديث تاريخ آخر تعديل
            },
            { new: true }
        );

        console.log("Message added:", savedMessage);
    } catch (error) {
        console.error("Error adding message:", error);
    } finally {
        mongoose.connection.close(); // اغلق الاتصال بعد الانتهاء
    }
};

addMessage();