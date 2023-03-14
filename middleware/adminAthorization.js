const session = require("express-session");
const db = require("../models");
const User = require('../models/users')
const DATE = new Date()

function authenticated(req, res, next) {

    if(req.session.user.is_admin && req.session.user != undefined ){
        next()
    } else { 
        res.redirect('/')
    }
}

module.exports = authenticated