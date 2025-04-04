const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
          username: {
    required: true,
          type:String,
  },
  email: {
          required: true,
          type:String,
          trim:true,
          validate:{
                    validator:(value)=>{
                              const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                              return value.match(re);

                    },
                    message : 'Please enter a valid email address'
          }},
          password : {
                    required : true,
                    type : String,
                    validate:{
                              validator:(value)=>{

                                        return value.length > 6;
   
                              },
                              message : 'Please enter al long password'
                    }
          },
          profile_image:{
            type: String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQO9_H_BMfei2M9QHnxPlvqxdgK3_pylPnFjjcMrDGK0BPl1P5otuXMx5_1TJA5qn0zBE&usqp=CAU"
          }
         
      
    
});


const Users = mongoose.model('UsersVibechat', userSchema);
module.exports = {Users};