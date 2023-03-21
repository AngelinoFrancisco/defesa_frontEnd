const session = require("express-session"); 

function authenticated(req, res, next) {

    if(req.session.user != undefined &&  req.session.user.is_admin){
        next() 
    } else { 
        console.log('a sessão deve ter expirado no admin')
        res.redirect('/')
    }
} 

module.exports = authenticated