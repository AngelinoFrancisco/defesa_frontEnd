const express = require('express')
const Login = express.Router()
const User = require('../models/users')
const midAdmin = require('../middleware/authadmin')
const session = require('express-session')
const bcrypt = require("bcrypt")
const db = require('../models/index')
const  axios = require('axios')
const userDate = new Date()
const adminDate = new Date()



Login.get('/', (req, res) => {
    res.render('login')
})

Login.post('/login', async (req, res) => {

    const params = {
     email:req.body.email,
     password:req.body.password 
        
    } 
 

    try{

    const response  = await axios.post('http://127.0.0.1:3333/api/login', params )
   
    if(response.data.user.is_admin){

        req.session.user = response.data.user
        req.session.token = response.data.token
        res.render('admin/admindashboard',{
            users:response.data.user
        })

    }else{

        req.session.user = response.data.user
        req.session.token = response.data.token
        res.render('user/userdashboard',{
            dados:response.data.user })

    }


    }catch(evt){

        res.redirect('/')

    }

   



    // await User.findOne({
    //     raw: true, where: {
    //         nome: nome, senha: senha
    //     }
    // }).then(resultado => {
    //     if (resultado != undefined || resultado != null) {
    //         if (resultado.isadmin != true) {
    //             res.redirect('/user/login')
    //         } else {

    //             db.Frequencia.findOne({
    //                 raw: true, where: {
    //                     userId: resultado.id
    //                 }  
    //             }).then(frequenteAdmin => { 
    //                 if (frequenteAdmin != null || frequenteAdmin !=undefined) {
    //                     frequenteAdmin.data = adminDate.toISOString()
    //                     frequenteAdmin.hora = adminDate.toLocaleTimeString()

    //                     db.Frequencia.update(frequenteAdmin, {
    //                         where: {
    //                             userId: resultado.id
    //                         }
    //                     }).then(() => {
            
    //                         User.update({
    //                             isonline: true
    //                         }, {
    //                             where: {
    //                                 id: resultado.id
    //                             }
    //                         })
                              
    //                         req.session.admin = resultado
    //                         res.redirect("/admin/admindashboard")
            
            
    //                     })
            
    //                 } else {
    //                     db.Frequencia.create({
    //                         data: adminDate.toISOString(),
    //                         hora: adminDate.toLocaleTimeString(),
    //                         userId: resultado.id
    //                     }).then(() => {
    //                         User.update({
    //                             isonline: true
    //                         }, {
    //                             where: {
    //                                 id: resultado.id
    //                             }
    //                         }).then(() => {
            
    //                             req.session.admin = resultado;
    //                             res.redirect('/admin/admindashboard')
            
    //                         })
            
    //                     })
            
    //                 }
            
    //             })
            
    //         }

    //     } else {
    //         res.redirect('/login')
    //     }
    // }).catch((erro) => {
    //     res.status(201).send(erro)
    // })
})

module.exports = Login;