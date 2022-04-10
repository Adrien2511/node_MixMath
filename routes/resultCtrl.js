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
            function (done)
            {
                models.Player.findAll({
                    where:{UserId : userId}
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
            {
                listDuelId = []
                for(let i = 0; i<playerFound.length;i++)
                {
                    listDuelId.push(playerFound[i].dataValues.DuelId)
                }
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

                    for(let j=0;j<adversairePlayer.length;j++) {
                        if(adversairePlayer[j].dataValues.DuelId == playerFound[i].dataValues.DuelId) {


                            var json = {
                                player: playerFound[i].dataValues,
                                adversaire : adversairePlayer[j].dataValues
                            }
                            vecRes.push(json)
                        }
                    }
                }
                res.send(vecRes)
            }

        ])
    },

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
    }
}