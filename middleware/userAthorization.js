
const session = require("express-session");
const api = require('./api')
const { default: axios } = require('axios')

async function authenticated(req, res, next) {

    if (req.session.user == undefined || req.session.user.is_admin) {

            res.redirect('/')

    } else {
        next()
    }
}

module.exports = authenticated