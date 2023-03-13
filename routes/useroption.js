const express = require('express')
const UserOption = express.Router()
const midAdmin = require('../middleware/authadmin')
const session = require('express-session')
const User = require('../models/users')
const db = require('../models/index')
const DATE = new Date() 

UserOption.get('/info', (req, res) => {

    User.findOne({
        where: {
            id: req.session.user.id
        }
    }).then(result => {
        res.json(result)
    }).catch(erro => {
        res.send('login')
    })

})

UserOption.get('/delete/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    User.destroy({
        where: {
            id: id
        }
    }).then(result => {

        res.redirect('/admin/usuario')
    }).catch(erro => {
        res.send(erro)
    })

})


UserOption.get('/logout', (req, res) => { 
    User.update({
        isonline: false
    },
        {
            where: {
                id: req.session.user.id
            }
        }
    ).then(() => {

        db.Frequencia.update({
            data:DATE.toISOString(),
            hora:DATE.toLocaleTimeString(),
        }, {
            where: {
                userId:req.session.user.id
            }
        }).then(()=>{
            
        req.session.destroy()
        res.redirect('/')

        }).catch(erros=>{
            res.status(404).send(erros)
        })
    }).catch((erro) => {
        res.status(201).send(erro)
    })


})

UserOption.post('/update', (req, res) => {


    const user = {
        nome: req.body.nome,
        senha: req.body.senha,
        email: req.body.email,
        bi: req.body.bi,
        id: req.body.id
    }

    req.session.user = user

    if (req.session.user != undefined || req.session.user != null) {
        User.update({
            nome: user.nome,
            senha: user.senha,
            email: user.email,
            bipassrecover: user.bi
        }, {
            where: {
                id: user.id,
                email: user.email
            }
        }).then(() => {
            User.findAll({
                raw: true
            }).then(result => {
                res.render("admin/usuario", {

                    dados: result,
                    users: req.session.user


                })
            })


        }).catch((erro) => {
            res.send(erro)
        })

    }

})

module.exports = UserOption;