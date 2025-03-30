const bcrypt = require('bcryptjs');
const { Users } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/error_handler');

const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'asdxasdxajtdmwajtdmw';
const register = errorHandler(async (req, res) => {
    const { username, email, password,profile_image} = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ msg: "Please enter a username, email, and password" });
    }
    
    const existing = await Users.findOne({ email });
    if (existing) {
        return res.status(409).send({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = new Users({
        username,
        email,
        password: hashedPassword,
        profile_image,
    });

    // حفظ المستخدم أولاً
    await user.save();

    // إنشاء التوكن بعد حفظ المستخدم
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    
    // إزالة كلمة المرور من الإرجاع
    user.password = undefined;
    res.status(201).json({ token, ...user._doc });
});

const login = errorHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ msg: 'Email or password not valid' });
    }

    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(404).send({ SUCCESS: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send({ msg: "Invalid password" });
    }

    user.password = undefined;
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    
    res.status(200).json({ token, ...user._doc });
});

module.exports = {
    register,
    login
};
