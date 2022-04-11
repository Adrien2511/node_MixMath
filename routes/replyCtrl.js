var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports = {
    //obtenir tout les personnes à qui répondre un duel
    getAllReply : function (req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            //obtenir tout les reply de la personne
            function(done)
            {
                models.Reply.findAll({
                    where : {UserId : userId}
                })
                    .then(function (replyFound)
                    {
                        done(null,replyFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },

            function(replyFound,done) {
                //les id de tout les adversaires
                let listId = []
                for (let i = 0; i < replyFound.length; i++) {
                    listId.push(replyFound[i].dataValues.idAdversaire)
                }
                console.log(listId)
                //trouver tout les profils des adversaires
                models.User.findAll({
                    where: {id: listId}
                })
                    .then(function (userFound) {
                        //res.send(userFound)
                        done(null, replyFound, userFound)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // associer le nom de l'adversaire avec le reply
            function(replyFound,userFound,done)
            { let vecRes = []
                for (let i=0; i<replyFound.length; i++)
                {
                    //replyFound[i].push(userFound[i].dataValues.firstName)
                   for(let j=0; j<userFound.length;j++)
                   {
                       if(userFound[j].dataValues.id == replyFound[i].dataValues.idAdversaire)
                       {
                           var json = {firstname : userFound[j].dataValues.firstName,
                               id : replyFound[i].dataValues.id,
                               idDuel : replyFound[i].dataValues.idDuel,
                               idAdversaire : replyFound[i].dataValues.idAdversaire,}
                           vecRes.push(json)
                       }
                   }
                }
                res.send(vecRes)
            }
            ])
    },
    //supprimer un reply selon l'id
    delete : function (req,res)
    {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var replyId = parseInt(req.params.replyId);


        models.Reply.destroy({
            where:{id:replyId}
        })
            .then(function(replySupp){
                res.send(replySupp)
            })
            .catch(function (err){
                console.log(err)
            })
    }
}