const db = require('../models')
const User = require('../models/users')

const userLogin = async (req, res)=>{
    db.Frequencia.findOne({
        raw: true, where: {
            userId: resultado.id
        }
    }).then(frequente => {
        console.log(frequente, "user")
        if (frequente != null) {
            db.Frequencia.update({
                data: userDate.toISOString(),
                hora: userDate.toLocaleTimeString()
            }, {
                where: {
                    userId: frequente.userId
                }
            }).then(() => {

                User.update({
                    isonline: true
                }, {
                    where: {
                        id: frequente.userId
                    }
                }).then(() => {
                    req.session.user = resultado;
                    res.redirect('/user/userdashboard')

                })
            })


        } else {
            db.Frequencia.create({
                data: userDate.toISOString(),
                hora: userDate.toLocaleTimeString(),
                userId: resultado.id
            }).then(() => {
                User.update({
                    isonline: true
                }, {
                    where: {
                        id: resultado.id
                    }
                }).then(() => {

                    req.session.user = resultado;
                    res.redirect('/user/userdashboard')

                })

            })

        }

    })


}



module.exports = {
    userLogin

}