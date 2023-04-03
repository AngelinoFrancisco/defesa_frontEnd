const express = require('express')
const Admin = express.Router()
const midAdmin = require('../middleware/adminAthorization')
const session = require('express-session')
const authAdmin = require('../middleware/adminAthorization')
const api = require('../middleware/api')
const {default:axios} = require('axios')
const { response } = require('express')
const fs= require('fs')


Admin.get('/admin/download/:uuid/:nome', authAdmin, (req,res)=>{
    
    const uid = req.params.uuid
    const nome = req.params.nome 
    const path = `./public/books/${uid}.pdf` 
    res.download(path,nome)
})

Admin.get('/admin/delete_book/:uuid', authAdmin, async (req,res)=>{
    const uuids = req.params.uuid 
    const pathfile = `./public/books/${uuids}.pdf` 

    const config = {
        "Authorization":`${req.session.token.type} ${req.session.token.token}`
    }

    try{

        
        await axios.delete(`${api}/excluir_relatorio/${uuids}`, {
            headers:config
        }).then((evt)=>{
            
        fs.rm(pathfile, async (err,response)=>{
            if(err){
                console.log('houve um erro')
                return res.redirect('/admin/admindasboard')
            }
            return  res.redirect('/admin/admindashboard')

        })
        
        }).catch((erros)=>{
            
        res.redirect('/admin/admindashboard')

        })
        
         

    }catch(erros){
        console.log(erros)
        res.redirect('/admin/logout')

    }
})


Admin.get('/admin/grafico', authAdmin, async (req, res) => {
    const config = {
        'Authorization': `${req.session.token.type} ${req.session.token.token}`
    }
 
    try {

        const response = await axios.get(`${api}/atividades`, {
            headers: config
        })
        const dados = response.data
        res.status(200).send(dados)
    } catch (evt) {
        console.log("erros", evt)
        res.redirect('/')
    }
})


Admin.get('/admin/logout', authAdmin, async (req, res) => {


    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }
    const id = req.session.user.id


    try {
        const response = await axios.get(`${api}/logout/${id}`,
            {
                headers: config
            })

        console.log(` logout retornou :${response.data}`)
        res.redirect('/')


    } catch (erros) {
        console.log(` logout retornou :${erros.data}`)
        res.redirect('/')

    }
})


Admin.get('/admin/admindashboard', authAdmin, async (req, res) => {
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }
    try {
        const atividades = await axios.get(`${api}/atividades`, {
            headers:config
        })

        if(!atividades || atividades.data.length === 0 ){ return res.redirect('/admin/usuario')}

        const duties = await axios.get(`${api}/relatorios`, {
            headers: config
        })  
        res.render('admin/admindashboard', { users: req.session.user ,
            Duties:duties.data,
            Atividades:atividades.data
        
            })

    } catch (erros) {
        console.log(erros)
        res.redirect('/admin/logout')
    }


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
            headers: config
        })
        const offline = await axios.get(`${api}/offline`, {
            headers: config
        })


        response.data.forEach(evt => {
            if (evt.is_online) {
                onlines.push(evt)
            } else {
                offlines.push(evt)
            }
        })



        res.render('admin/usuario', {
            users: req.session.user,
            dados: response.data,
            userOnlines: onlines,
            userOfflines: offlines,
            ons: online.data,
            offs: offline.data
        })



    } catch (errers) {
        res.redirect('/')

    }


})


Admin.post('/admin/update', authAdmin, async (req, res) => {

    const id = req.body.id
    const updatedUser = {
        nome: req.body.nome,
        email: req.body.email,
        bipassrecover: req.body.bipassrecover

    }
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {
        const response = await axios.put(`${api}/update_user/${id}`, updatedUser, {
            headers: config
        })

        if (!response.data) {
            return res.redirect('/admin/logout')
        }

        res.redirect('/admin/admindashboard')


    } catch (erros) {
        console.log(erros)
        res.redirect('/admin/logout')

    }


})

Admin.post('/admin/filtrar_relatorio', authAdmin, async (req,res)=>{
    const search = req.body.search
    const tipo = req.body.tipo
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }
    try {
        const response = await axios.get(`${api}/duty/${tipo}/${search}`, {
            headers: config
        })
        
        const atividades = await axios.get(`${api}/atividades`, {
            headers:config
        })

        if(!atividades || atividades.data.length === 0 || !atividades.data ){ 
            console.log("pode estar nas atividades")
            return res.redirect('/admin/admidashboard')}

        if (!response.data || response.data.length === 0 || !response.data ) {
            console.log('pode estar no Duties')
            return res.redirect('/admin/admidashboard')
        }
 

       return res.render('admin/relatorio', {
            users: req.session.user,
            Duties: response.data,
            Atividades:atividades.data
        })


    } catch (erros) {
        console.log(erros.data)
        res.redirect('/admin/logout')
    }

})

Admin.post('/admin/search', authAdmin, async (req, res) => {
    const search = req.body.search
    const tipo = req.body.tipo
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {
        const response = await axios.get(`${api}/user/${tipo}/${search}`, {
            headers: config
        })

        if (response.data.length === 0 || !response.data) {
            return res.redirect('/admin/usuario')
        }

        res.render('admin/search', {
            users: req.session.user,
            dado: response.data
        })


    } catch (erros) {
        console.log(erros)
        res.redirect('/admin/logout')
    }

})

Admin.get('/admin/delete/:id', authAdmin, async (req, res) => {
    const id = req.params.id

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {

        const response = await axios.delete(`${api}/one/${id}`, {
            headers: config
        })

        if (!response.data) {
            return res.redirect('/admin/logout')
        }


        res.redirect('/admin/admindashboard')

    } catch (erros) {
        console.log(erros)

        res.redirect('/admin/logout')
    }



})
Admin.get('/admin/reclamacao/:id', authAdmin, async (req, res) => {
    const id = req.params.id
    console.log(id)
    
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try{ 
        
        const response = await axios.get(`${api}/reclamacao/${id}`, {
            headers:config
        })
        
        if(!response.data){
            return res.redirect('/admin/admindashboard')
        }

        res.redirect('/admin/contacto')
        
    }catch(erros){
        console.log(erros)

        res.redirect('/')
    }


  
})

Admin.get('/admin/contacto', authAdmin, async (req, res) => {
    
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try{ 
        
        const response = await axios.get(`${api}/reclamacao`, {
            headers:config
        })
 

        res.render('admin/contacto', {
            Reclamacao:response.data.recall,
            Users:response.data.users,
            users: req.session.user
    })
        
    }catch(erros){
        console.log(erros)

        res.redirect('/')
    }


  
})


 

module.exports = Admin;