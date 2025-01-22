const bcrypt = require('bcryptjs');
const pool = require('../models/db');
const { Users } = require('../models/user.model');
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
                    const existing = await Users.findOne({email});
                    if(!existing){
                              res.status(404).send({
                                        msg: "email already exists"
                              });
                    }
                    const hashedPassword = await bcrypt.hash(password, SALT);
                    const user = new Users({
                              username,
                              email,
                              password: hashedPassword
                    })
                    await user.save();
                    res.satus(201).json({
                              user
                    })
          }catch(e){
                    res.status(500).json({
                              msg: "Invalid request" + e.message
                    })
          }
}

module.exports = {
          register
}