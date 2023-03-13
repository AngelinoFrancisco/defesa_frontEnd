const express = require('express')
const Userdashboard = express.Router()
const midAdmin = require('../middleware/authadmin')
const session = require('express-session')
const User = require('../models/users')
const userController = require('../controllers/userController')


Userdashboard.post('/user/login', userController.userLogin)


Userdashboard.get('/user/userdashboard',(req,res)=>{ 
    if(req.session.user != undefined || req.session.user != null){

        User.findAll({raw:true
        }).then(result =>{
             res.render('user/userdashboard',{
            dados:result 
            })
          
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        res.redirect('/')
    }

})



Userdashboard.get('/user/perfil',(req,res)=>{ 
    if(req.session.user != undefined || req.session.user != null){

        User.findAll({raw:true
        }).then(result =>{
             res.render('user/perfil',{
            dados:result 
            })
          
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        res.redirect('/')
    }

})

Userdashboard.get('/user/ajuda',(req,res)=>{ 
    if(req.session.user != undefined || req.session.user != null){

        User.findAll({raw:true
        }).then(result =>{
             res.render('user/ajuda',{
            dados:result 
            })
          
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        res.redirect('/')
    }

})

Userdashboard.get('/user/relatorio',(req,res)=>{ 
    if(req.session.user != undefined || req.session.user != null){

        User.findAll({raw:true
        }).then(result =>{
             res.render('user/relatorio',{
            dados:result 
            })
          
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        res.redirect('/')
    }

})




module.exports=Userdashboard;