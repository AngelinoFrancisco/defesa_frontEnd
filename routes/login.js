const express = require('express')
const Login = express.Router() 
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const bcrypt = require("bcrypt") 
const  axios = require('axios')
const jwt = require('jsonwebtoken')
const api = require('../middleware/api')



Login.get('/', (req, res) => {
    res.render('login')
})

Login.post('/', async (req, res) => {

    const params = {
     email:req.body.email,
     password:req.body.password 
        
    } 
    console.log(params)
 

    try{

    const response  = await axios.post(`${api}/login`, params )
 
   
    if(response.data.user.is_admin){
        
        req.session.user = response.data.user
        req.session.token = response.data.token
        
        console.log(req.session.token)
        res.redirect('/admin/admindashboard')

    }else{

        req.session.user = response.data.user
        req.session.token = response.data.token

        console.log(response.data.token)
        res.redirect('/user/userdashboard')

    }


    }catch(evt){
        console.log(evt)

        res.redirect('/')

    }

})

module.exports = Login;