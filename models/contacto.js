const sequelize = require('sequelize')
const dbconnection = require('../database/db')

const Contato = dbconnection.define('Contato',{
    categoria:{
        type:sequelize.STRING,
        allowNull:false
    },
    data:{
        type:sequelize.DATE,
        allowNull:false
        
    },
    conteudo:{
        type:sequelize.TEXT,
        allowNull:false
    }
    
},{
    
    timestamps:false
    })

Contato.sync({force:false}).then(()=>{
    console.log('Tabela Contato criada com sucesso ')
})

module.exports=Contato;