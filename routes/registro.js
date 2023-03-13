const express = require('express')
const Sigin = express.Router()
const User = require('../models/users')
const axios = require('axios')

//const bodyParser = require('body-parser')
Sigin.get('/registro',(req,res)=>{
    res.render('registro')
})


Sigin.post('/registro', async (req,res)=>{

    const newUser ={
     nome :req.body.nome,
     password:req.body.password,
     email :req.body.email,
     bipassrecover :req.body.bipassrecover,
    }

    if( !newUser.nome || newUser.nome == undefined || !newUser.password || newUser.password == undefined || !newUser.bipassrecover || newUser.bipassrecover == undefined   ){

         res.redirect('/registro')

    }else{
        try{
            const response = await axios.post("http://127.0.0.1:3333/api/registro", newUser)
         
           if(response == true){ 
            res.redirect('/registro')
           }else{
            res.redirect('/')
           }
       
        }catch(evt){
            res.redirect('/registro')
    
        }
        

    }
  
})

module.exports=Sigin;