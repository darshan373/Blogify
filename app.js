require('dotenv').config()
const express=require("express")
const app=express();
const PORT= process.env.PORT;
const path=require("path")
const userRouter=require("./routes/user")
const blogRouter=require("./routes/blog")
const mongoose=require("mongoose")
var cookieParser = require('cookie-parser')
const {Blog}=require("./models/blog")

const {connectmongoDB}=require("./connection/connect");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");
connectmongoDB(process.env.MONGO_URL).then(() =>
    console.log("Mongodb connected")
  ).catch((err)=> console.log("error connecting DB"));
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))
app.use("/user",userRouter)
app.use("/blog",blogRouter)







app.get("/",async(req,res)=>{
  const allblogs=await Blog.find({})
    return res.render("home",{user:req.user,
      allblogs:allblogs
    })
 })




app.listen(PORT,()=>{
    console.log("Server started at "+PORT)
})