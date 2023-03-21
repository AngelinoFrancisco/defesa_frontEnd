const express = require('express')
const Userdashboard = express.Router()
const userAuth = require('../middleware/userAthorization')
const session = require('express-session')
const axios = require('axios')
const api = require('../middleware/api') 
const PDF = require('html-pdf')
const tempo =  new  Date()
const  {v4:uuidv4} = require('uuid')
const uuid = uuidv4()
const fs =  require('fs')

Userdashboard.post('/user/gerar_relatorio', userAuth, async(req, res)=>{
 
    const content = req.body.content 
    const params= {
        nome:req.body.nome,
        test:req.body.test,
        user_id:req.session.user.id,
        uuid:uuid
    }
    if( !params.nome || params.test == undefined || !params.test || !content ){
        return res.redirect('/user/gerar_relatorio')
    }else{
 
    try{
        await axios.post(`${api}/relatorio`,params)
        PDF.create(content, {}).toFile(`./public/books/${params.uuid}.pdf`, async (err, response)=>{
            if(err){
                return res.redirect('/user/gerar_relatorio')
            }else{
                return res.redirect('/user/consultar_relatorio')
            }
         })
       
   }catch(erros){
    res.redirect('/user/gerar_relatorio')

   }
    }

});


Userdashboard.get('/user/userdashboard', userAuth, (req, res) => {
    res.render('user/userdashboard', { users: req.session.user })

})

Userdashboard.get('/user/gerar_relatorio',userAuth, (req, res)=>{

    res.render('user/relatorio',{users:req.session.user})


})


Userdashboard.get('/user/consultar_relatorio',userAuth, (req, res)=>{

    res.render('user/relatorios_gerados',{users:req.session.user})


})



Userdashboard.get('/user/perfil', userAuth, (req, res) => {
    res.render('user/perfil', { users: req.session.user })

})

Userdashboard.get('/user/ajuda', userAuth, (req, res) => {
    res.render('user/ajuda', { users: req.session.user })
})

Userdashboard.get('/user/relatorio', (req, res) => {
    res.render('user/relatorio', { users: req.session.user })


})

Userdashboard.get('/user/logout', userAuth, async (req, res) => {

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
Userdashboard.post('/user/threats', userAuth, async (req, res) => {
    const search = {
        test :req.body.test,
        url : req.body.url
    }
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }

    try{
        const response = await axios.get(`${api}/counts/${search.test}`, {
            headers:config
        })
        console.log('dados', response.data)
        if(response.data === " não autenticado"){
            return res.redirect('/')
        }
        return  res.json(response.data)
    }catch(errors){
        console.log(errors)
        res.redirect('/')
    }
})




module.exports = Userdashboard;