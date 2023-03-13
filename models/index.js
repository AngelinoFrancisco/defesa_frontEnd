const { Sequelize } = require("sequelize")
const sequelize = require('sequelize')


const db= {}


db.Sequelize = Sequelize
db.sequelize = sequelize
db.User = require('./users')
db.Frequencia = require('./frequencia')


db.User.hasMany(db.Frequencia,{
    foreignkey:'userId',
    as:'frequencia'
})


db.Frequencia.belongsTo(db.User,{
    foreignkey:'userId',
    as:'user'
})

module.exports= db

