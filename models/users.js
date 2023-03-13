 
const sequelize = require('sequelize')
const Frequencia = require('./frequencia')
const dbconnection = require('../database/db')
const { Model } = require('sequelize')

const User = dbconnection.define('User',{
    nome:{
        type:sequelize.STRING,
        allowNull:false
    },
    senha:{
        type:sequelize.STRING,
        allowNull:false
    },
    email:{
        type:sequelize.STRING,
        allowNull:false
    }
    ,
    isadmin:{
        type:sequelize.BOOLEAN,
        defaultValue:false
    },
    bipassrecover:{
        type:sequelize.STRING,
        allowNull:false

    },
    isonline:{
        type:sequelize.BOOLEAN,
        defaultValue:false

    },
    id_contacto:{
        type:sequelize.INTEGER,
        foreignKey:true,   
    }
},{
    
    timestamps:false
    })  
Model.associations= ()=>{
    Model.belongsTo(Model.Frequencia,{
        foreignKey:'idFrequencia', as:'freqs'
    })
}

User.sync({force:false}).then(()=>{
    console.log('Tabela user criada com sucesso 1')
})

module.exports=User;

 