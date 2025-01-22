const bcrypt = require('bcryptjs');
const { Users } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'asdxasdxajtdmwajtdmw';
const register = async (req, res) => {
          try{
                    const {username, email, password} = req.body;
                    if(!username || !email || !password){
                              return res.status(404).send({
                                        msg:"please enter a username and email and password"
                              })
                    }
                    const existing = await Users.findOne({email: email});
                    if(existing){
                              return res.status(409).send({
                                        msg: "email already exists"
                              });
                    }
                    const hashedPassword = await bcrypt.hash(password, SALT);
                    const user = new Users({
                              username,
                              email,
                              password: hashedPassword
                    })
                    const token = jwt.sign({id: user._id},JWT_SECRET ,);
                    await user.save();
                    res.status(201).json({token, ...user._doc});
                    
          }catch(e){
                    res.status(500).json({
                              msg: "Invalid request" + e.message
                    })
          }
}
const login =async (req, res) => {
          try{
                    const {email, password} = req.body;
                    if(!email || !password){
                              return res.status(409).send({
                                msg: 'email or password not valid',
                              })
                    }
                    const user = await Users.findOne({ email });
                    if (!user) {
                        return res.status(404).send({
                            SUCCESS: false,
                            message: "User not found"
                        });
                    }                 
                       const isMatch = await bcrypt.compare(password, user.password);
                       if(!isMatch) {
                              return res.status(404).send({
                                        msg: "Invalid password"
                              });
                       }
                       user.password = undefined;
                       const token = jwt.sign({id: user._id},JWT_SECRET ,);
 res.status(201).json({token, ...user._doc});
                 
          }catch(e){
                    res.status(500).json({
                              msg: "Invalid request" + e.message
                    })      
          }
}
module.exports = {
          register,
          login
}