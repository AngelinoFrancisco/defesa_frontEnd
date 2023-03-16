const express = require('express')
const Userdashboard = express.Router() 
const userAuth =  require('../middleware/userAthorization')
const session = require('express-session') 

 


Userdashboard.get('/user/userdashboard', userAuth, (req,res)=>{ 
    res.render('user/userdashboard', {users:req.session.user})

})



Userdashboard.get('/user/perfil', userAuth, (req,res)=>{ 
    res.render('user/perfil', {users:req})

})

Userdashboard.get('/user/ajuda',(req,res)=>{ 
     
})

Userdashboard.get('/user/relatorio',(req,res)=>{ 
     

})




module.exports=Userdashboard;