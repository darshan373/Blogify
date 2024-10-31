const { Router } = require("express");
const router = Router();
const {Blog}=require("../models/blog")
const {Comment}=require("../models/comment")
const multer  = require('multer')
const path=require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/uploads/"))
    },

    
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`
      cb(null, filename)
    },
  })
  const upload = multer({ storage: storage })
router.get("/addblog",(req,res)=>{
    return res.render("AddBlog",{user:req.user})
})
router.get("/:id",async(req,res)=>{
const blog=await Blog.findById(req.params.id).populate("createdBy");
const comments=await Comment.find({blogId:req.params.id}).populate("createdBy")

return res.render("blog",{user:req.user,
    blog:blog,
    comments:comments
})
})
router.post("/comment/:blogId",async(req,res)=>{
  
  
await Comment.create({
  content:req.body.content,
  blogId:req.params.blogId,
  createdBy:req.user._id
})
return res.redirect(`/blog/${req.params.blogId}`)
})
router.post("/",upload.single("coverimage"),async (req,res)=>{
    const {title,body}=req.body;
    
const blog=await Blog.create({
    title,
    body,
    createdBy:req.user._id,
    coverimageurl:`/uploads/${req.file.filename}`
})
    return res.redirect(`/blog/${blog._id}`)
})
module.exports = router;