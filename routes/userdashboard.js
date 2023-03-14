const express = require('express')
const Userdashboard = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const User = require('../models/users') 

 


Userdashboard.get('/user/userdashboard',(req,res)=>{ 
    

})



Userdashboard.get('/user/perfil',(req,res)=>{ 
    

})

Userdashboard.get('/user/ajuda',(req,res)=>{ 
     
})

Userdashboard.get('/user/relatorio',(req,res)=>{ 
     

})




module.exports=Userdashboard;