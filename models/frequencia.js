const { Model } = require('sequelize')
const sequelize = require('sequelize') 

const dbconnection = require('../database/db')
const User = require('./users')

const Frequencia = dbconnection.define('Frequencia',{
    hora:{
        type:sequelize.TIME,
        allowNull:false
    },
    data:{
        type:sequelize.DATEONLY,
        allowNull:false
    },
    userId:{
        type:sequelize.INTEGER,
        foreignKey:true
    }
},
{
       
timestamps:false
}


)
 
    Model.associations= ()=>{
        
    Model.hasOne(Model.User,{
        foreignKey:'idUser', as:'user'
    }) 

    }


Frequencia.sync({force:false}).then(()=>{
    console.log('Tabela Frequencia criada com sucesso ')
})

module.exports=Frequencia;