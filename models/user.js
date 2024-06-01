const {Schema,model, default: mongoose}=require("mongoose");
const { createHmac, randomBytes } = require('node:crypto');
const {createTokenForUser,validateToken}=require("../service/authentication")
const userSchema=new Schema({
    fullname:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
        unique:true
        
    },
    profileimageurl:{
        type:String,
        default:"/images/default.jpg"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true})

userSchema.static("matchpassword",async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error("email does not found");
console.log(user)
    const salt=user.salt;
    const hashedpassword=user.password;
    const userprovidedhash = createHmac('sha256', salt)
               .update(password)
               .digest('hex');
    if(hashedpassword!==userprovidedhash) throw new Error("password does not match");
    return token=createTokenForUser(user);
})

userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashedpassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
    this.salt=salt;
    this.password=hashedpassword;
    next()
})
const User=model("user",userSchema)

module.exports={User};