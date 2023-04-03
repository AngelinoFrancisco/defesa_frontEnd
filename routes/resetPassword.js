const express = require('express')
const resetPassword = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session') 
const api = require('../middleware/api')
const {default:axios} = require('axios')

resetPassword.get('/resetpassword',(req,res)=>{
    res.render('recover')
})

 

resetPassword.post('/resetpassword', async(req,res)=>{ 

    const body ={
        
     email :req.body.email,
     bipassrecover :req.body.bipassrecover
        
    }
    if(body.email == null || body.bipassrecover == null){
        return res.redirect('/resetpassword')
    }

    try{
        const response = await axios.post(`${api}/reset`, body)

        if(!response.data || !response){
            return res.redirect('/resetpassword')
        }

         res.render('recoveryupdate', {user:response.data})


    }catch(erros){
        console.log(erros)
        res.redirect('/resetpassword')
    }
  

})


// update password


resetPassword.post('/resetpasswordupdate',async (req,res)=>{ 
    const password = req.body.password;
    const id = req.body.id; 

    const body = {
        password:password,
        id:id
    }
 

    if(body.password == null || body.password == undefined){
        return res.redirect('/resetpassword')
    }

    try{
        const response = await axios.post(`${api}/resetupdate/${id}`, body)
        if(!response.data || !response){ 
            return res.redirect('/resetpassword')
        }

        return res.redirect('/')

    }catch(erros){
        console.log(erros)
        res.redirect('/resetpassword')

    }


    
 
   
})

 

module.exports=resetPassword;