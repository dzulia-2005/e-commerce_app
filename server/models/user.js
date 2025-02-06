const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },

    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
    },

    password:{
        type:String,
        require:true
    },
    profilePicture : {
      type:String,
      default:"",
    },

    card : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"item"
    }],

    profilePicture : {
        type: String,
        default:""
    },

    

    blocklist : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }



},{timestamps:true});

const user = mongoose.model("user",userSchema);
module.exports = user;