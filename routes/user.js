const { Router } = require("express");
const router = Router();
const { User } = require("../models/user");
router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchpassword(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin",{error:"Invalid Email or password"});
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
 try {
  await User.create({
    fullname,
    email,
    password,
  });
  
  return res.redirect("/")
 } catch (error) {
  return res.render("signup",{error:"Email already exists"});
 }
 
});

router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/")
})

module.exports = router;
