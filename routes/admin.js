const express = require('express')
const Admin = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const authAdmin = require('../middleware/adminAthorization')
const api = require('../middleware/api')
const axios = require('axios')
const { response } = require('express')
 

Admin.get('/admin/grafico', authAdmin, async(req, res)=>{
    const config = {
        'Authorization':`${req.session.token.type} ${req.session.token.token}`
    }

    try{

        const response = await axios.get(`${api}/atividades`,{
            headers:config
        } )
        const dados = response.data 
        res.status(200).send(dados)
    }catch(evt){ 
        console.log("erros", evt)
        res.redirect('/')
    }
})


Admin.get('/admin/logout', authAdmin, async (req, res) => {


    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }
    const  id = req.session.user.id


    try{
        const response = await axios.get(`${api}/logout/${id}`, 
       {
        headers:config
       })
       
       console.log(` logout retornou :${response.data}`)
       res.redirect('/')
        

    }catch(erros){
        console.log(` logout retornou :${erros.data}`)
        res.redirect('/')

    }
})


Admin.get('/admin/admindashboard', authAdmin, (req, res) => {
    res.render('admin/admindashboard', { users: req.session.user })

})



Admin.get('/admin/usuario', authAdmin, async (req, res) => {

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    const onlines = new Array()
    const offlines = new Array()

    try {
        const response = await axios.get(`${api}/users`, {
            headers: config
        })
        const online = await axios.get(`${api}/online`, {
            headers:config
        })
        const offline= await axios.get(`${api}/offline`, {
            headers:config
        })
 

        response.data.forEach(evt=>{
            if(evt.is_online){
                onlines.push(evt)
            }else{
                offlines.push(evt)
            }
        })
 
        

        res.render('admin/usuario', {
            users: req.session.user,
            dados: response.data,
            userOnlines:onlines,
            userOfflines:offlines,
            ons:online.data,
            offs:offline.data
        })



    } catch (errers) {
        res.redirect('/')

    }


})


Admin.post('/admin/update', authAdmin ,async (req,res)=>{

    const id = req.body.id 
    const updatedUser = {
        nome:req.body.nome,
        email:req.body.email,
        bipassrecover:req.body.bipassrecover

    } 
    const config = {
       "Authorization": `${req.session.token.type} ${req.session.token.token}`
   }

   try{
    const response = await axios.put(`${api}/update_user/${id}`,updatedUser, {
        headers:config
    })

    if(!response.data){
        return res.redirect('/admin/logout')
    }

    res.redirect('/admin/admindashboard')


   }catch(erros){
    console.log(erros)
        res.redirect('/admin/logout')

   }


})

Admin.post('/admin/search',authAdmin ,async (req,res)=>{
    const search = req.body.search
    const tipo = req.body.tipo 
    const config = {
       "Authorization": `${req.session.token.type} ${req.session.token.token}`
   }
   try{
    const response = await axios.get(`${api}/user/${tipo}/${search}`, {
        headers:config
    })

    if(!response.data){
        return res.redirect('/admin/logout')
    }

    res.redirect('/admin/admindashboard')


   }catch(erros){
    console.log(erros)
    res.redirect('/admin/logout')
   }

})

Admin.get('/admin/delete/:id',authAdmin , async (req,res)=>{
     const id = req.params.id

     const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try{

        const response = await axios.delete(`${api}/one/${id}`,{
            headers:config
        } )

        if(!response.data){
            return res.redirect('/admin/logout')
        }
 

        res.redirect('/admin/admindashboard')

    }catch(erros){
        console.log(erros)

        res.redirect('/admin/logout')
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