const session = require("express-session");
const {default:axios}  =require('axios')
const api = require('./api')

async function  authenticated(req, res, next) {

    if(req.session.user != undefined &&  req.session.user.is_admin){
        next() 
    } else { 
    res.redirect('/') 
         



    }
} 

module.exports = authenticated