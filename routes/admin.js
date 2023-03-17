const express = require('express')
const Admin = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const authAdmin = require('../middleware/adminAthorization')
const api = require('../middleware/api')
const axios = require('axios')


Admin.get('/admin/logout', authAdmin, async (req, res) => {


    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }
    const params = {
        user_id: req.session.user.id
    }


    try{
        const response = await axios.post(`${api}/user`, params)
        if(response != undefined){
            console.log(response)
        }
    
        

    }catch(erros){

    }

    // try {
    //     const response = await axios.post(`${api}/logout`, {
    //         headers: config
    //     },{
    //         params:params
    //     })

    //     console.log("response", response.data)
    //     res.redirect('/')



    // } catch (errers) {
    //     console.log("errors", errers.data)
    //     res.redirect('/')

    // }

})


Admin.get('/admin/admindashboard', authAdmin, (req, res) => {
    res.render('admin/admindashboard', { users: req.session.user })

})



Admin.get('/admin/usuario', authAdmin, async (req, res) => {

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {
        const response = await axios.get(`${api}/users`, {
            headers: config
        })

        // console.log("resultados recebidos", response.data)

        res.render('admin/usuario', {
            users: req.session.user,
            dados: response.data
        })



    } catch (errers) {
        res.redirect('/')

    }


})

Admin.get('/admin/contacto', authAdmin, (req, res) => {
    res.render('admin/contacto', {
        users: req.session.user
    })
})



Admin.post('/search', authAdmin, (req, res) => {


    const selected = req.body.classe
    const resp = req.body.resp

    if (req.session.admin != undefined || req.session.admin != null) {

        if (selected != undefined) {


            if (selected == "id") {

                User.findOne({
                    raw: true,
                    where: {
                        id: resp
                    }
                }).then(result => {
                    if (result != undefined) {
                        res.render('admin/search', {
                            dado: result,
                            users: req.session.admin
                        })
                    } else {
                        res.json({ 'msg': 'Usuario ou  identificador nao existem' })
                    }
                }).catch(erro => {
                    res.send(erro)
                })

            }
            if (selected == "nome") {

                User.findOne({
                    raw: true,
                    where: {
                        nome: resp
                    }
                }).then(result => {
                    if (result != undefined) {
                        res.render('admin/search', {
                            dado: result,
                            users: req.session.admin
                        })
                    } else {
                        res.json({ 'msg': 'Usuario ou  identificador nao existem' })
                    }
                }).catch(erro => {
                    res.send(erro)
                })


            }

            if (selected == "todos") {

                User.findAll({
                    raw: true
                }).then(result => {
                    res.render('admin/usuario', {
                        dados: result,
                        users: req.session.admin
                    })
                }).catch(erro => {
                    res.send(erro)
                })


            }

        } else {
            res.json({ "msg": "usuario ou dados incorretos" })
        }


    } else {
        res.redirect('/')
    }

})


module.exports = Admin;