const sequelize = require('sequelize')


// senha>>> binario0721
const connection = new sequelize('connected','root','',{
    host:'localhost',
    dialect:'mysql'
})

module.exports = connection; 