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
 

    try{

    const response  = await axios.post(`${api}/login`, params )
   // console.log(response)
   
    if(response.data.user.is_admin){
 
        req.session.user = response.data.user
        req.session.token = response.data.token
        
        //console.log(req.session.token)
        res.render('admin/admindashboard', {
            users:req.session.user
        })

    }else{

        req.session.user = response.data.user
        req.session.token = response.data.token

        //console.log(response.data.token)
        res.render('user/userdashboard',{
            users:req.session.user
        })

    }


    }catch(evt){

        res.redirect('/')

    }

})

module.exports = Login;