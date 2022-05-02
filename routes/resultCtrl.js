var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
const { Op } = require("sequelize");

module.exports = {
    //obtenir ses résultats
    myResult : function (req,res)
    {
        //valeur de l'id
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            //obtenir toutes les parties de la personne
            function (done)
            {
                models.Player.findAll({
                    where:{UserId : userId},
                    include: [
                        {
                            model : models.Duel,
                            attributes: ['idQuestion']
                        }
                    ]
                })
                    .then(function(playerFound)
                    {
                        //res.send(playerFound)
                        done(null,playerFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },
            function (playerFound,done)
            {   //list des id des duels
                listDuelId = []
                for(let i = 0; i<playerFound.length;i++)
                {
                    listDuelId.push(playerFound[i].dataValues.DuelId)
                }
                // partie joué par tout les adversaires de la personne
                models.Player.findAll({
                    where:{ UserId: { [Op.not]: userId}, DuelId : listDuelId},
                    include: [{
                        model: models.User,
                        attributes: [ 'firstName' ]
                    },
                        {
                            model : models.Duel,
                            attributes: ['idQuestion']
                        }
                    ]
                })
                    .then(function (adversairePlayer)
                    {
                        done(null,adversairePlayer,playerFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },
            function (adversairePlayer,playerFound,done)
            {
                let vecRes = []
                for(let i=0;i<playerFound.length;i++)
                {
                  var ajout = Boolean(false)

                    for(let j=0;j<adversairePlayer.length;j++) {
                        if(adversairePlayer[j].dataValues.DuelId == playerFound[i].dataValues.DuelId) {

                            ajout = true
                            var jsonPlayer ={
                                id: playerFound[i].dataValues.id,
                                score: playerFound[i].dataValues.score,
                                Q1: playerFound[i].dataValues.Q1,
                                Q2: playerFound[i].dataValues.Q2,
                                Q3: playerFound[i].dataValues.Q3,
                                Q4: playerFound[i].dataValues.Q4,
                                Q5: playerFound[i].dataValues.Q5,

                                DuelId: playerFound[i].dataValues.DuelId,
                                UserId: playerFound[i].dataValues.UserId,
                                idQuestion: playerFound[i].dataValues.Duel.dataValues.idQuestion
                                }

                            var jsonAdversaire ={
                                id: adversairePlayer[j].dataValues.id,
                                score: adversairePlayer[j].dataValues.score,
                                Q1: adversairePlayer[j].dataValues.Q1,
                                Q2: adversairePlayer[j].dataValues.Q2,
                                Q3: adversairePlayer[j].dataValues.Q3,
                                Q4: adversairePlayer[j].dataValues.Q4,
                                Q5: adversairePlayer[j].dataValues.Q5,

                                DuelId: adversairePlayer[j].dataValues.DuelId,
                                UserId: adversairePlayer[j].dataValues.UserId,
                                idQuestion: adversairePlayer[j].dataValues.Duel.dataValues.idQuestion,
                                firstName : adversairePlayer[j].dataValues.User.dataValues.firstName
                            }

                            /*var json = {
                                player: playerFound[i].dataValues,
                                adversaire : adversairePlayer[j].dataValues
                            }*/
                        var json = {
                            player: jsonPlayer,
                            adversaire : jsonAdversaire
                        }

                            vecRes.push(json)
                        }
                    }
                  if(ajout == false)
                  {
                      var jsonPlayer ={
                          id: playerFound[i].dataValues.id,
                          score: playerFound[i].dataValues.score,
                          Q1: playerFound[i].dataValues.Q1,
                          Q2: playerFound[i].dataValues.Q2,
                          Q3: playerFound[i].dataValues.Q3,
                          Q4: playerFound[i].dataValues.Q4,
                          Q5: playerFound[i].dataValues.Q5,

                          DuelId: playerFound[i].dataValues.DuelId,
                          UserId: playerFound[i].dataValues.UserId,
                          idQuestion: playerFound[i].dataValues.Duel.dataValues.idQuestion
                      }

                      var jsonAdversaire ={

                          score: "...",
                          Q1: "Pas de réponse",
                          Q2: "Pas de réponse",
                          Q3: "Pas de réponse",
                          Q4: "Pas de réponse",
                          Q5: "Pas de réponse",
                          firstName :"..."
                      }
                      var json = {
                          player: jsonPlayer,
                          adversaire : jsonAdversaire
                      }
                      vecRes.push(json)

                  }

                }
                res.send(vecRes)
            }

        ])
    },
    // les resultats de tout le monde
    allResult : function (req,res)
    {

        asyncLib.waterfall([
            function (done)
            {
                models.Player.findAll({
                })
                    .then(function(playerFound)
                    {
                        res.send(playerFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            }
        ])
    },
    studentResult : function (req,res)
    {
        //valeur de l'id
        var userId = parseInt(req.params.userId);

        asyncLib.waterfall([
            //obtenir toutes les parties de la personne
            function (done)
            {
                models.Player.findAll({
                    where:{UserId : userId},
                    include: [
                        {
                            model : models.Duel,
                            attributes: ['idQuestion']
                        }
                    ]
                })
                    .then(function(playerFound)
                    {
                        //res.send(playerFound)
                        done(null,playerFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },
            function (playerFound,done)
            {   //list des id des duels
                listDuelId = []
                for(let i = 0; i<playerFound.length;i++)
                {
                    listDuelId.push(playerFound[i].dataValues.DuelId)
                }
                // partie joué par tout les adversaires de la personne
                models.Player.findAll({
                    where:{ UserId: { [Op.not]: userId}, DuelId : listDuelId},
                    include: [{
                        model: models.User,
                        attributes: [ 'firstName' ]
                    },
                        {
                            model : models.Duel,
                            attributes: ['idQuestion']
                        }
                    ]
                })
                    .then(function (adversairePlayer)
                    {
                        done(null,adversairePlayer,playerFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },
            function (adversairePlayer,playerFound,done)
            {
                let vecRes = []
                for(let i=0;i<playerFound.length;i++)
                {
                    var ajout = Boolean(false)

                    for(let j=0;j<adversairePlayer.length;j++) {
                        if(adversairePlayer[j].dataValues.DuelId == playerFound[i].dataValues.DuelId) {

                            ajout = true
                            var jsonPlayer ={
                                id: playerFound[i].dataValues.id,
                                score: playerFound[i].dataValues.score,
                                Q1: playerFound[i].dataValues.Q1,
                                Q2: playerFound[i].dataValues.Q2,
                                Q3: playerFound[i].dataValues.Q3,
                                Q4: playerFound[i].dataValues.Q4,
                                Q5: playerFound[i].dataValues.Q5,

                                DuelId: playerFound[i].dataValues.DuelId,
                                UserId: playerFound[i].dataValues.UserId,
                                idQuestion: playerFound[i].dataValues.Duel.dataValues.idQuestion
                            }

                            var jsonAdversaire ={
                                id: adversairePlayer[j].dataValues.id,
                                score: adversairePlayer[j].dataValues.score,
                                Q1: adversairePlayer[j].dataValues.Q1,
                                Q2: adversairePlayer[j].dataValues.Q2,
                                Q3: adversairePlayer[j].dataValues.Q3,
                                Q4: adversairePlayer[j].dataValues.Q4,
                                Q5: adversairePlayer[j].dataValues.Q5,

                                DuelId: adversairePlayer[j].dataValues.DuelId,
                                UserId: adversairePlayer[j].dataValues.UserId,
                                idQuestion: adversairePlayer[j].dataValues.Duel.dataValues.idQuestion,
                                firstName : adversairePlayer[j].dataValues.User.dataValues.firstName
                            }

                            /*var json = {
                                player: playerFound[i].dataValues,
                                adversaire : adversairePlayer[j].dataValues
                            }*/
                            var json = {
                                player: jsonPlayer,
                                adversaire : jsonAdversaire
                            }

                            vecRes.push(json)
                        }
                    }
                    if(ajout == false)
                    {
                        var jsonPlayer ={
                            id: playerFound[i].dataValues.id,
                            score: playerFound[i].dataValues.score,
                            Q1: playerFound[i].dataValues.Q1,
                            Q2: playerFound[i].dataValues.Q2,
                            Q3: playerFound[i].dataValues.Q3,
                            Q4: playerFound[i].dataValues.Q4,
                            Q5: playerFound[i].dataValues.Q5,

                            DuelId: playerFound[i].dataValues.DuelId,
                            UserId: playerFound[i].dataValues.UserId,
                            idQuestion: playerFound[i].dataValues.Duel.dataValues.idQuestion
                        }

                        var jsonAdversaire ={

                            score: "Pas encore joué",
                            Q1: "Pas de réponse",
                            Q2: "Pas de réponse",
                            Q3: "Pas de réponse",
                            Q4: "Pas de réponse",
                            Q5: "Pas de réponse",
                            firstName :"En attente"
                        }
                        var json = {
                            player: jsonPlayer,
                            adversaire : jsonAdversaire
                        }
                        vecRes.push(json)

                    }

                }
                res.send(vecRes)
            }

        ])
    },
}