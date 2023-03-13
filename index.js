const express =require('express')
//const sequelize = require('sequelize')
const app = express()
const dbconnection = require('./database/db')
const Login = require('./routes/login')
const Cadastro = require('./routes/registro') 
const bodyParser = require('body-parser') 
const axios = require('axios')
//Middleware 
const session = require('express-session') 
const middle = require('./middleware/authadmin')
//models 
const User = require('./models/users')
const Relatorio = require('./models/relatorio') 
const Atividade = require('./models/atividade')
const Contato = require('./models/contacto')
const Frequencia = require('./models/frequencia')

// controllers 



// view 
const ejs = require('ejs')
const resetPassword = require('./routes/resetPassword')
const UserOption = require('./routes/useroption')
const Admin = require('./routes/admin')
const Userdashboard=require('./routes/userdashboard') 
const server = require('http').createServer(app)
const websocket = require('ws')
const wss = new websocket.WebSocketServer({server:server})




app.use(express.static('public')) 
app.set('view engine', 'ejs');
//app uses 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//definindo sessao para o user  
 
app.use(session({
    secret:'breakmeagainnevermore123',
    cookie:{
        maxAge: 1800000       
    }
}))


//Db connection 

dbconnection.authenticate().then(()=>{
    console.log('conectado com sucesso')
}
).catch(()=>{
    console.log('Erro na conecao com a DB ')
})
//Routes conection 

app.use(Login)
app.use(Cadastro) 
app.use(middle)
app.use(Userdashboard)
app.use(resetPassword)
app.use(UserOption) 
app.use(Admin) 

// connection between the server and the client

 


//Server listeing 
app.listen(3000,(erro)=>{ 
    if(erro){
    console.log(erro)
    }else{
    console.log('Working')   

    
    
    }
})
   