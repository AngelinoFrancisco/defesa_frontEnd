const express =require('express')
//const sequelize = require('sequelize')
const app = express() 
const Login = require('./routes/login')
const Cadastro = require('./routes/registro') 
const bodyParser = require('body-parser') 
const axios = require('axios')
const jwt = require('jsonwebtoken')
const flash = require("express-flash")
const cookieParser = require("cookie-parser")



//Middleware 
const session = require('express-session') 
const authAdmin = require('./middleware/adminAthorization')
const authUser = require('./middleware/userAthorization') 



// view 
const ejs = require('ejs')
const resetPassword = require('./routes/resetPassword') 
const Admin = require('./routes/admin')
const Userdashboard=require('./routes/userdashboard')  
app.use(cookieParser())
app.use(flash())

app.use(express.static('public')) 
app.set('view engine', 'ejs');
app.set('views', './views');

//app uses 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//definindo sessao para o user  
 
app.use(session({
    secret:'breakmeagainnevermore123',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1800000       
    }
}))


app.use(Cadastro) 
app.use(Login)  
app.use(resetPassword)
app.use(Userdashboard)
app.use(Admin) 

 


//middlewere

app.use(authAdmin)
app.use(authUser)

//Server listeing 
app.listen(3000,(erro)=>{ 
    if(erro){
    console.log(erro)
    }else{
    console.log('Working')   

    
    
    }
})
   