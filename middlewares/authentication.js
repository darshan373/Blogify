const {validateToken}=require("../service/authentication")

function checkForAuthenticationCookie(cookiename){
return (req,res,next)=>{
    const tokencookieName=req.cookies[cookiename]
 if(!tokencookieName){
  return  next()
}
try {
    const payload=validateToken(tokencookieName);
    req.user=payload;
} catch (error) {
    
}
return next()
}
}

module.exports={checkForAuthenticationCookie}
    