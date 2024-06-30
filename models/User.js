const mongoose =require('mongoose');

const userSchema = mongoose.Schema({
    name :{
        type:String, require:true
    },
    email :{
        type:String,require: true, unique : true
    },
    password: {
        type:String,require:true
    },
    role :{
        type : String, enum:["admin","user"], default:"user"
    }
},{
    timestamps:true
});

const User = mongoose.model('users',userSchema);

module.exports =User;