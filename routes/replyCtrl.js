var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports = {

    getAllReply : function (req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            function(done)
            {
                models.Reply.findAll({
                    where : {UserId : userId}

                })
                    .then(function (replyFound)
                    {

                        done(null,replyFound)
                        //res.send(replyFound)
                    })
                    .catch(function (err){
                        console.log(err)
                    })
            },

            function(replyFound,done) {
                let listId = []
                for (let i = 0; i < replyFound.length; i++) {
                    listId.push(replyFound[i].dataValues.idAdversaire)
                }
                console.log(listId)
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
                console.log(vecRes)
                res.send(vecRes)

            }
/*
                        let vecRes = []
                        for (let i=0; i<replyFound.length; i++)
                        {
                            //replyFound[i].push(userFound[i].dataValues.firstName)
                            models.User.findOne({
                                where:{id:replyFound[i].dataValues.idAdversaire}
                            }).then(function (userFound){
                               var json = {firstname : userFound[i].dataValues.firstName,
                                    id : replyFound[i].dataValues.id,
                                    idDuel : replyFound[i].dataValues.idDuel,
                                    UserId : replyFound[i].dataValues.idAdversaire,}
                                vecRes.push(json)
                                console.log(vecRes)

                            })
                                .catch(function (err){console.log(err)})

                        }
                        console.log(vecRes)
                        res.send(vecRes)
                        res.send(userFound)*/





            ])
    }
}