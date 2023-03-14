const express =require('express')
//const sequelize = require('sequelize')
const app = express() 
const Login = require('./routes/login')
const Cadastro = require('./routes/registro') 
const bodyParser = require('body-parser') 
const axios = require('axios')


//Middleware 
const session = require('express-session') 
const authAdmin = require('./middleware/adminAthorization')
const authUser = require('./middleware/userAthorization') 



// view 
const ejs = require('ejs')
const resetPassword = require('./routes/resetPassword')
const UserOption = require('./routes/useroption')
const Admin = require('./routes/admin')
const Userdashboard=require('./routes/userdashboard')  




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
 

app.use(Login)
app.use(Cadastro) 
app.use(authAdmin)
app.use(authUser)
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
   