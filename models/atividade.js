const sequelize = require('sequelize')
const dbconnection = require('../database/db')

const Atividade = dbconnection.define('Atividade',{
    nome:{
        type:sequelize.STRING,
        allowNull:false
    },
    quantidade:{
        type:sequelize.STRING,
        allowNull:false
    }
 
},{
    
    timestamps:false
    })

Atividade.sync({force:false}).then(()=>{
    console.log('Tabela Atividade criada com sucesso ')
})

module.exports=Atividade;