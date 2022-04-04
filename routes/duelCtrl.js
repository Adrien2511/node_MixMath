var bcrypt = require('bcrypt');
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');


module.exports = {

    createDuel:function (req,res)
    {
        models.Duel.create(
            {
                idQuestion : 1
            }
        )
    },

    Duel: function(req,res)
    {
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            function(done)
            { // touver la classe de la personne
              models.InClass.findOne({
                      where: {userId: userId}
                  })
                  .then(function(classe){
                      done(null,classe)
                  })
                  .catch(function (err){
                      console.log(err)
                  })

            },
            function (classe,done)
            {  // trouver toute les personnes de la classe
                models.InClass.findAll({
                    where:{ classId : classe.classId}
                })
                    .then(function (userClass){
                        done(null,userClass)
                    })
                    .catch(function (err){
                        return res.status(500).json({ 'error': 'Personne dans la classe' });
                    })
            },

            function ( userClass,done) {   // enregister tout les personnes de la class
                let listId = []
                for (let i = 0; i < userClass.length; i++) {
                    listId.push(userClass[i].dataValues.userId)
                }
                console.log("toute les personnes " + listId)


                models.User.findAll({
                    where: {id: listId, isAdmin: false}
                })
                    .then(function (userNotAdmin) {
                        done(null, userNotAdmin)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            function (userNotAdmin,done){
                let listId = []
                for (let i = 0; i < userNotAdmin.length; i++) {
                    listId.push(userNotAdmin[i].dataValues.id)
                }
                console.log("list sans admin "+ listId)

                // supprimer soit même
                for (var i = 0; i < listId.length; i++) {
                    if (listId[i] === userId) {
                        listId.splice(i, 1);
                    }

                }
                console.log("sans lui même "+ listId)
                var adversaireId = listId[Math.floor(Math.random()*listId.length)];
                console.log(adversaireId)

                res.status(200).json(listId)

            }

        ])

    }

}