const express = require('express')
const Login = express.Router()
const User = require('../models/users')
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const bcrypt = require("bcrypt")
const db = require('../models/index')
const  axios = require('axios')



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

})

module.exports = Login;