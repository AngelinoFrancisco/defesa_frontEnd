 

function authenticated(req, res, next) {


    if(req.session.user.is_admin || req.session.user == undefined || req.session.user == null ){
        res.redirect('/')
    } else { 
        next() 
    }
}

module.exports = authenticated