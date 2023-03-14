const session = require("express-session"); 

function authenticated(req, res, next) {

    if( req.session.user != undefined && req.session.user.is_admin ){
        next()
    } else { 
        res.redirect('/')
    }
}

module.exports = authenticated