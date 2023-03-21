 
const session = require("express-session");

function authenticated(req, res, next) {

    if( req.session.user == undefined || req.session.user.is_admin ){

        console.log('a sessão deve ter expirado no user')
        res.redirect('/')
    } else { 
        next() 
    }
}

module.exports = authenticated