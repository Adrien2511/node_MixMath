var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports = {
    create : function (req,res)
    {
        var headerAuth  = req.headers['authorization'];
        var userAdmin      = jwtUtils.getUserAdmin(headerAuth);
        var userId      = jwtUtils.getUserId(headerAuth);

        var duelId= req.body.duelId;
        var score = req.body.score;
        var Q1 = req.body.Q1;
        var Q2 = req.body.Q2;
        var Q3 = req.body.Q3;
        var Q4 = req.body.Q4;
        var Q5 = req.body.Q5;


        asyncLib.waterfall([
            function (done)
            {
                models.Player.create({
                    UserId : userId,
                    DuelId : duelId,
                    score : score,
                    Q1 : Q1,
                    Q2 : Q2,
                    Q3 : Q3,
                    Q4 : Q4,
                    Q5 : Q5,
                })
                    .then(function (player){
                        res.send(player)
                    })
                    .catch(function (err){
                        console.log(err)
                    })

            }
        ])

    }
}