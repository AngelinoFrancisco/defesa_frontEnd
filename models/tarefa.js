const sequelize = require('sequelize')
const dbconnection = require('../database/db')

const Tarefa = dbconnection.define('Tarefa',{
   
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

Tarefa.sync({force:false}).then(()=>{
    console.log('Tabela Tarefa criada com sucesso ')
})

module.exports=Relatorio;