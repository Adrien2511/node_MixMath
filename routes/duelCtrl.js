var bcrypt = require('bcrypt');
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');


module.exports = {



    Duel: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var idQuestion = req.body.idQuestion;
        console.log(req.body.idQuestion)

        asyncLib.waterfall([
            // touver la classe de la personne
            function (done) {
                models.InClass.findOne({
                    where: {userId: userId}
                })
                    .then(function (classe) {
                        done(null, classe)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // trouver toute les personnes de la classe
            function (classe, done) {
                models.InClass.findAll({
                    where: {classId: classe.classId}
                })
                    .then(function (userClass) {
                        done(null, userClass)
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'Personne dans la classe'});
                    })
            },
            // enregister tout les personnes de la classe
            function (userClass, done) {
                //obtenir tout les id des personnes de la classe
                let listId = []
                for (let i = 0; i < userClass.length; i++) {
                    listId.push(userClass[i].dataValues.userId)
                }
                //trouver toutes les personnes de la classe et pas prof
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
            function (userNotAdmin, done) {
                let listId = []
                for (let i = 0; i < userNotAdmin.length; i++) {
                    listId.push(userNotAdmin[i].dataValues.id)
                }
                // supprimer soit même
                for (var i = 0; i < listId.length; i++) {
                    if (listId[i] === userId) {
                        listId.splice(i, 1);
                    }
                }

                // choix de l'adversaire aléatoire
                const adversaireId = listId[Math.floor(Math.random() * listId.length)];

                models.Duel.create(
                    {
                        idQuestion: idQuestion
                    }
                )
                    .then(function (duel){
                        done(null,duel,adversaireId)
                    })
                    .catch(function (err){console.log(err)})

            },
            function (duel,adversaireId,done)
            {
                models.Reply.create({

                    UserId: adversaireId,
                    idAdversaire: userId,
                    idDuel : duel.id
                })
                    .then(function (reply){
                        //res.send(reply)
                        var json = { duelId : duel.dataValues.id}
                        res.send(json)
                    })
                    .catch(function (err){console.log(err)})

            }

        ])

    },

    getAllDuel : function (req,res)
    {
        models.Duel.findAll()
            .then(function (allDuel){
                res.send(allDuel)
            })
            .catch(function (err){
                console.log(err)
            })

    }

}