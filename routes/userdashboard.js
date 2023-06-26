const express = require('express')
const Userdashboard = express.Router()
const userAuth = require('../middleware/userAthorization')
const session = require('express-session')
const { default: axios } = require('axios')
const api = require('../middleware/api')
const generate = require('html-pdf')
const tempo = new Date()
const puppeteer = require("puppeteer")
const fs = require('fs')
const flash = require("express-flash")


Userdashboard.post('/user/gerar_relatorio', userAuth, async (req, res) => {

    // const result = Math.floor( Math.random()*123456789987654826376 + 1)
    // console.log(result)

    function validarInput(input) {
        const regex = /\s/; // Expressão regular para verificar espaços em branco
        const regexCaracteresEspeciais = /[^a-zA-Z0-9\sç]/g;
        const regexLetrasAcentuadas = /[áàâãéèêíïóôõöúçñ]/gi;

        const contemEspeciais = regexCaracteresEspeciais.test(input);
        const contemEspacos = regex.test(input)
        const contemAcentuadas = regexLetrasAcentuadas.test(input);

        if (contemEspeciais || contemEspacos || contemAcentuadas) {

            return true
        }

        return false

    }



    const { v4: uuidv4 } = require('uuid')
    const uuid = uuidv4()

    const content = req.body.content
    const params = {
        nome: req.body.nome,
        test: req.body.test,
        user_id: req.session.user.id,
        uuid: uuid
    }

    const filepath = `./public/books/${params.uuid}.pdf`
    if (!params.nome || !params.test || !content || params.nome == null || params.test == null || content == null || params.nome == undefined|| params.test == undefined || content == undefined) {
        req.flash('campos-vazios', 'Não pode submeter campos vazios!')
        return res.redirect('/user/gerar_relatorio')
    }
    const validado = validarInput(params.nome)
    if (validado) {
        req.flash('relatorio-espaco', "o nome não pode conter espaços, caracteres especias ou acentos")
        return res.redirect("/user/gerar_relatorio")
    }

    try {


        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        await page.setContent(content)
        const pdf = await page.pdf()
        await browser.close()

        fs.writeFile(filepath, pdf, async function (err) {
            if (err) {
                console.error(err)

                return res.redirect("/user/gerar_relatorio")
            }
            await axios.post(`${api}/relatorio`, params)

            return res.redirect("/user/consultar_relatorio")
        })

    } catch (err) {

        console.error(err)

        return res.redirect("/user/gerar_relatorio")

    }

});


Userdashboard.get('/user/userdashboard', userAuth, (req, res) => {
    const erroTecnico = req.flash('erro-tecnico')
    res.render('user/userdashboard', { users: req.session.user, erroTecnico })

})

Userdashboard.get('/user/gerar_relatorio', userAuth, (req, res) => {
    const espacos = req.flash('relatorio-espaco')
    const camposVazios = req.flash('campos-vazios')
    res.render('user/relatorio', { users: req.session.user, espacos, camposVazios })


})
Userdashboard.get('/user/download/:uuid/:nome', userAuth, (req, res) => {
    const uid = req.params.uuid
    const nome = req.params.nome
    const path = `./public/books/${uid}.pdf`
    res.download(path, nome)
})
Userdashboard.get('/user/excluir_relatorio/:uuid', userAuth, async (req, res) => {
    const uuids = req.params.uuid
    const pathfile = `./public/books/${uuids}.pdf`

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {


        await axios.delete(`${api}/excluir_relatorio/${uuids}`, {
            headers: config
        }).then((evt) => {
            fs.rm(pathfile, async (err, response) => {
                if (err) {
                    console.log('houve um erro')
                    return res.redirect('/user/consultar_relatorio')
                }
                return res.redirect('/user/consultar_relatorio')
            })


        }).catch((erros) => {

            return res.redirect('/user/consultar')
        })



    } catch (erros) {
        console.log(erros)
        res.redirect('/user/userdashboard')

    }




})


Userdashboard.get('/user/consultar_relatorio', userAuth, async (req, res) => {
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }



    try {

        const Duties = await axios.get(`${api}/relatorio/${req.session.user.id}`, {
            headers: config
        })

        const atividades = await axios.get(`${api}/atividades`, {
            headers: config
        })
        if (!atividades || atividades.data.length === 0) { return res.redirect('/user/userdashboard') }

        if (!Duties || Duties.data.length === 0) {
            return res.redirect('/user/gerar_relatorio')
        }

        const espacos = req.flash('relatorio-espaco')
        const camposVazios = req.flash('campos-vazios') 
        const alertSearch = req.flash('alert-search')
        res.render('user/relatorios_gerados',
            {
                users: req.session.user,
                Duties: Duties.data,
                Atividades: atividades.data,
                camposVazios,
                espacos,
                alertSearch
            })
    } catch (erros) {
        console.log(erros)
        res.redirect('/user/logout')

    }



})


Userdashboard.post('/user/filtrar_relatorio', userAuth, async (req, res) => {
    const search = req.body.search
    const tipo = req.body.tipo
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }
    function validarInput(input) {
        const regex = /\s/; // Expressão regular para verificar espaços em branco
        const regexCaracteresEspeciais = /[^a-zA-Z0-9\sç]/g;
        const regexLetrasAcentuadas = /[áàâãéèêíïóôõöúçñ]/gi;

        const contemEspeciais = regexCaracteresEspeciais.test(input);
        const contemEspacos = regex.test(input)
        const contemAcentuadas = regexLetrasAcentuadas.test(input);

        if (contemEspeciais || contemEspacos || contemAcentuadas) {

            return true
        }

        return false

    }
    const pesquisa = validarInput(search)



  

    try {
        if(!search || search == null || search == undefined || !tipo || tipo == null || tipo == undefined ){
            req.flash('campos-vazios','Não pode conter campos vazios ou dados incorrentos')
          return res.redirect('/user/consultar_relatorio')
        }
    
        if (pesquisa) {
            req.flash('relatorio-espaco', "o nome não pode conter espaços, caracteres especias ou acentos")
            return res.redirect('/user/consultar_relatorio')
        }

        const response = await axios.get(`${api}/duty/${tipo}/${search}`, {
            headers: config
        })
        const atividades = await axios.get(`${api}/atividades`, {
            headers: config
        })

        if (!atividades || atividades.data.length === 0 || !atividades.data) {

            req.flash('alert-search', 'Melhore a pesquisa, nenhum dado relacionado!')
            req.flash('erro-tecnico', 'Erro técnico, consulte o Administador!')
            return res.redirect('/user/consultar_relatorio')
        }

        if (!response.data || response.data.length === 0 || !response.data) {

            req.flash('alert-search', 'Melhore a pesquisa, nenhum dado relacionado!')
            req.flash('erro-tecnico', 'Erro técnico, consulte o Administador!')
            return res.redirect('/user/consultar_relatorio')
        }




        return res.render('user/relatorios', {
            users: req.session.user,
            Duties: response.data,
            Atividades: atividades.data
        })


    } catch (erros) {
        console.log(erros.data)
        res.redirect('/user/logout')
    }

})



Userdashboard.get('/user/perfil', userAuth, (req, res) => {
    res.render('user/perfil', { users: req.session.user })

})

Userdashboard.post('/user/update', userAuth, async (req, res) => {
    const id = req.body.id
    console.log(id)
    const newUser = {
        nome: req.body.nome,
        email: req.body.email,
        password: req.body.password,
        bipassrecover: req.body.bipassrecover
    }

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }


    try {
        const response = await axios.put(`${api}/update_user/${id}`, newUser, {
            headers: config
        })

        if (!response.data) {
            console.log('erro aqui')
            return res.redirect('/user/logout')
        }

        res.redirect('/user/logout')


    } catch (erros) {
        console.log(erros)
        res.redirect('/user/logout')

    }





})


Userdashboard.get('/user/excluir/:id', userAuth, async (req, res) => {
    const id = req.params.id

    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`
    }

    try {

        const response = await axios.delete(`${api}/one/${id}`, {
            headers: config
        })

        if (!response.data) {
            return res.redirect('/user/logout')
        }


        res.redirect('/')

    } catch (erros) {
        console.log(erros)

        res.redirect('/user/logout')
    }


})
Userdashboard.get('/user/ajuda', userAuth, (req, res) => {
    res.render('user/ajuda', { users: req.session.user })
})

Userdashboard.post('/user/ajuda', userAuth, async (req, res) => {
    const ajuda = {
        categoria: req.body.categoria,
        conteudo: req.body.conteudo,
        user_id: req.session.user.id
    }
    console.log(ajuda)

    if (ajuda.categoria == null || ajuda.categoria == undefined || ajuda.conteudo == null || ajuda.conteudo == undefined) {
        return res.redirect('/user/ajuda')
    }


    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }

    try {
        const response = await axios.post(`${api}/reclamacao`, ajuda, {
            headers: config
        })

        if (!response.data || !response) {
            return res.redirect('/user/userdashboard')
        }
        res.redirect('/user/ajuda')

    } catch (erros) {
        res.redirect('/')
    }




})

Userdashboard.get('/user/relatorio', userAuth, (req, res) => {
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
        test: req.body.test,
        target: req.body.url
    }
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }

    try {
        await axios.get(`${api}/counts/${search.test}`, {
            headers: config
        })

        if (search.test == "subdomains") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner1/${search.target}`)

            const arrDatas = []

            arrDatas.push(response.data)
            console.log(response.data)

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: arrDatas[0].result
            })
        }

        if (search.test == "vulnerabilities") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner2/nuclei?target_name=${search.target}&autoscan=false&tags=low,medium,high,critical`)


            console.log(response.data.length)
            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: response.data
            })
        }

        if (search.test == "clickjacking") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner6/${search.target}`)

            //console.log(response.data.result[0].length)
        
 
            const objetoJSON = JSON.parse(response.data[0]); 
            console.log(objetoJSON) // undefined

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results:objetoJSON
            })
        }


        if (search.test == "portscan") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner5/${search.target}`)


            console.log( "sem formatacao", response.data[0])

            const objetoJSON = JSON.parse(response.data[0]); 
            console.log(objetoJSON)
           // console.log(objetoJSON) // undefined
            //const jsonString = JSON.stringify(objetoJSON, null, 2); // Converte o objeto JSON em uma string JSON formatada
 

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: JSON.parse(response.data[0])
            })
        }


    } catch (errors) {
        console.log(errors)
        res.redirect('/')
    }
})




Userdashboard.post('/user/threat', userAuth, async (req, res) => {
    const search = {
        test: req.body.test,
        target: req.body.url
    }
    const config = {
        "Authorization": `${req.session.token.type} ${req.session.token.token}`

    }


    try {
        await axios.get(`${api}/counts/${search.test}`, {
            headers: config
        })


        //  const response = await axios.post(`${api}/bypass`, search, {
        //     headers: config
        // })



        if (search.test == "subdomains") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner1/${search.target}`)

            const arrDatas = []

            arrDatas.push(response.data)

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: arrDatas[0].result
            })
        }

        if (search.test == "vulnerabilities") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner2/nuclei?target_name=${search.target}&autoscan=false&tags=low,medium,high,critical`)


            console.log(response.data.length)
            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: response.data
            })
        }

        if (search.test == "clickjacking") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner6/${search.target}`)

            //console.log(response.data.result[0].length)
        
 
            const objetoJSON = JSON.parse(response.data[0]); 
            console.log(objetoJSON) // undefined

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results:objetoJSON
            })
        }


        if (search.test == "portscan") {
            const response = await axios.get(`http://127.0.0.1:1010/api/scanner5/${search.target}`)


            console.log( "sem formatacao", response.data[0])

            const objetoJSON = JSON.parse(response.data[0]); 
            console.log(objetoJSON)
           // console.log(objetoJSON) // undefined
            //const jsonString = JSON.stringify(objetoJSON, null, 2); // Converte o objeto JSON em uma string JSON formatada
 

            return res.render("user/result", {
                test: search.test,
                target: search.target,
                users: req.session.user,
                results: JSON.parse(response.data[0])
            })
        }


    } catch (errors) {
        console.log(errors)
        res.redirect('/')
    }
})



module.exports = Userdashboard;