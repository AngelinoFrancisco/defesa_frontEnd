const express = require('express')
const resetPassword = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session') 

resetPassword.get('/resetpassword',(req,res)=>{
    res.render('recover')
})

 

resetPassword.post('/resetpassword',(req,res)=>{ 
    const email = req.body.email;
    const bipassrecover = req.body.bipassrecover; 
 
    User.findOne({raw:true,
        where:{
            email:email,
            bipassrecover:bipassrecover
        }
    }).then(result =>{
        if(result!= undefined){
            console.log(result.id)
            res.render('recoveryupdate', {id:result.id})
        }else{
            res.json({'msg':'Usuario ou  senha de recuperacao nao encontrado'})
        }
    }).catch(erro=>{
        res.send(erro)
    })

})


// update password


resetPassword.post('/resetpasswordupdate',(req,res)=>{ 
    const senha = req.body.senha;
    const id = req.body.id; 
    
    User.update({
        //nome:nome,
        //senha:senha,
        senha:senha
        //,
        //bipassrecover:bi
    },{where:{
        id:id
    }
    }).then(()=>{
        res.redirect('/login')
    }).catch((erro)=>{
        res.json("ocorreu um erro ao salvar a senha!", erro)
    })
   
})

 

module.exports=resetPassword;