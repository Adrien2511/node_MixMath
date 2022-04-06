var bcrypt = require('bcrypt');
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

module.exports=
    {
        register:function (req,res)
        {   //avoir le titre de la personne
            var headerAuth  = req.headers['authorization'];
            var userAdmin      = jwtUtils.getUserAdmin(headerAuth);
            var userId      = jwtUtils.getUserId(headerAuth);

            //variables
            var name = req.body.name
            var password = req.body.password

            // vérifier que c'est un prof
            if(userAdmin)
            {
                asyncLib.waterfall([
                    function(done) {
                        //création de la classe
                        models.Class.create(
                            {
                                name: name,
                                password: password
                            }
                        )
                            .then(function (classe) {
                                res.status(200).send(classe)
                                done(null,classe)

                            })
                            .catch(function (err) {
                                res.json(err);
                            })
                    },
                    function (classe,done)
                    {
                        models.InClass.create({
                            userId : userId,
                            classId: classe.id
                        })
                            .then(function(newInClass) {
                                console.log(newInClass)
                            })
                            .catch(function(err){
                                console.log(err)
                            });
                    }
                    ])
            }
            else
            {
                res.status(400).json({'erro': 'pas le droit'})
            }
        },

        join:function (req,res)
        {
            var headerAuth  = req.headers['authorization'];
            var userId      = jwtUtils.getUserId(headerAuth);
            var userAdmin      = jwtUtils.getUserAdmin(headerAuth);

            var name = req.body.name;
            var password = req.body.password

            asyncLib.waterfall([
                function (done){
                models.Class.findOne({
                    where: {name : name, password : password}
                })
                    .then(function (classFound){
                        done(null,classFound)

                    })
                    .catch(function (err){
                        console.log(err)
                    })
                },
                function (classFound,done)
                {
                    if(classFound)
                    {
                        models.InClass.create({
                            userId : userId,
                            classId: classFound.id
                        })
                            .then(function(newInClass) {
                                done(newInClass);
                            })
                            .catch(function(err){
                                console.log(err)
                            });
                    }
                    else
                    {
                        res.status(404).json({ 'error': 'Class not found' });
                    }
                }
            ], function(newInClass) {
                if (newInClass) {
                    return res.status(201).json(newInClass);
                } else {
                    return res.status(500).json({ 'error': 'cannot post message' });
                }
            })


        },
        getAllClass : function (req,res)
        {
            var headerAuth  = req.headers['authorization'];
            var userId      = jwtUtils.getUserId(headerAuth);

            asyncLib.waterfall([
                function (done){
                    models.InClass.findAll({
                        where: {userId: userId},

                    })
                        .then(function (classFound) {
                            done(null,classFound)

                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                },
                function (classFound,done)
                {   var listClass = []
                    for(let i=0; i<classFound.length;i++)
                    {
                        listClass.push(classFound[i].dataValues.classId)
                    }
                    console.log(listClass)

                    models.Class.findAll({
                        where:{id : listClass}
                    })
                        .then(function (classe){
                            res.send(classe)
                        })
                        .catch(function (err){
                            console.log(err)
                        })
                }
            ])

        }

    }