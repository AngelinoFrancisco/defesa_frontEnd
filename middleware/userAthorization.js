 
const session = require("express-session");

function authenticated(req, res, next) {

    if( req.session.user == undefined || req.session.user.is_admin == true  || req.session.user == null ){
        res.redirect('/')
    } else { 
        next() 
    }
}

module.exports = authenticated