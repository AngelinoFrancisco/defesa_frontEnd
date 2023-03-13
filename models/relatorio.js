const sequelize = require('sequelize')
const dbconnection = require('../database/db')

const Relatorio = dbconnection.define('Relatorio',{
    nome:{
        type:sequelize.STRING,
        allowNull:false
    },
    data:{
        type:sequelize.DATE,
        allowNull:false
    },
    id_user:{
        type:sequelize.INTEGER,
        foreignkey:true
    }, 
    id_atividade:{
        type:sequelize.INTEGER,
        foreignkey:true
    }
},{
    
    timestamps:false
    })

Relatorio.sync({force:false}).then(()=>{
    console.log('Tabela Relatorio criada com sucesso ')
})

module.exports=Relatorio;