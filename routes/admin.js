const express = require('express')
const Admin = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const User = require('../models/users') 
const authAdmin =  require('../middleware/adminAthorization')

//Admin.post('/admin/login', adminController.login)

Admin.get('/admin/admindashboard', (req,res)=>{ 
    
    if(req.session.admin != undefined || req.session.admin != null){
        User.findAll({raw:true
        }).then(result =>{
            res.render('admin/admindashboard',{
            dados:result,
            users:req.session.admin
            })
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        console.log('sessão retornada foi  null')
        res.redirect('/')
    }

})



Admin.get('/admin/usuario', authAdmin, (req,res)=>{ 
    if(req.session.admin != undefined || req.session.admin != null){
        const users = req.session.admin
    
        User.findAll({raw:true}).then(result=>{
            res.render('admin/usuario',{
                dados:result,
                users:users

            })
        })
    }else{
        res.redirect('/')
    }

})
 
Admin.get('/admin/contacto',  authAdmin, (req,res)=>{

    if(req.session.admin != undefined || req.session.admin != null){
        User.findAll({raw:true
        }).then(result =>{
             res.render('admin/contacto',{
            dados:result,
            users:req.session.admin
            })
        }).catch(erro=>{
            res.send(erro)
        })
    }else{
        res.redirect('/')
    } 
})



Admin.post('/search', authAdmin, (req,res)=>{


    const selected = req.body.classe
    const resp = req.body.resp

    if(req.session.admin != undefined || req.session.admin != null){

        if(selected != undefined){


            if(selected == "id"){
 
                User.findOne({raw:true,
                    where:{
                        id:resp
                    }
                }).then(result =>{
                    if(result!= undefined){ 
                        res.render('admin/search', {
                            dado:result,
                            users:req.session.admin
                        })
                    }else{
                        res.json({'msg':'Usuario ou  identificador nao existem'})
                    }
                }).catch(erro=>{
                    res.send(erro)
                })
    
            }
            if(selected=="nome"){

                User.findOne({raw:true,
                    where:{
                        nome:resp
                    }
                }).then(result =>{
                    if(result!= undefined){ 
                        res.render('admin/search', {
                            dado:result,
                            users:req.session.admin
                        })
                    }else{
                        res.json({'msg':'Usuario ou  identificador nao existem'})
                    }
                }).catch(erro=>{
                    res.send(erro)
                })
            

            }

            if(selected=="todos"){

                User.findAll({raw:true
                }).then(result =>{
                     res.render('admin/usuario',{
                    dados:result,
                    users:req.session.admin
                    })
                }).catch(erro=>{
                    res.send(erro)
                })
            

            }

        }else{
            res.json({"msg":"usuario ou dados incorretos"})
        }

        
    }else{
        res.redirect('/')
    }

})

 
module.exports = Admin;