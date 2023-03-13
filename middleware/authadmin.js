const session = require("express-session");
const db = require("../models");
const User = require('../models/users')
const DATE = new Date()

function authenticated(req, res, next) {

    if (req.session.user != undefined || req.session.admin !=undefined) {
        //nome = req.session.user.nome
        next()
    } else {
        User.findAll({
            raw: true, where: {
                isonline: true
            }
        }).then((users) => {

            if (users != null || users != undefined) {
                User.update({
                    isonline: false
                }, {
                    where: {
                        isonline: true  
                    }
                }).then(() => {
                    users.forEach(value => {
                        db.Frequencia.update({ 
                            data: DATE.toISOString(),
                            hora: DATE.toLocaleTimeString(),
                        }, {
                            where: {
                                userId: value.id
                            }
                        })
                    }) 

                    res.redirect('/')

                })

            } else {
                console.log("nemhum usuario logado")
            }


        }).catch((erro) => {
            res.status(201).send(erro)
        })

    }
}

module.exports = authenticated