var bcrypt = require('bcrypt');
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

//constante
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//fonction
module.exports = {
    // focntion d'enregistrement 
    register: function(req,res){
        
        //variables
        var email = req.body.email;
        var name = req.body.name;
        var firstName = req.body.firstName;
        var password = req.body.password;
        var isAdmin = req.body.isAdmin;

        //vérification de la bonne forme
        if (email == null || name == null || password == null || firstName == null) {
            return res.status(400).json({'erro': 'missing parms'});
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'erro': 'Email not valid'});
        }

        asyncLib.waterfall([
            // vérification que la personne n'existe pase
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: {email: email}
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            // hashage du mot de passe 
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({'error': 'user already exist'});
                }
            },
            // création de la personne
            function (userFound, bcryptedPassword, done) {
                var newUser = models.User.create({
                    email: email,
                    name : name,
                    firstName : firstName,
                    password: bcryptedPassword,
                    isAdmin: isAdmin
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'cannot add user'});
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({'error': 'cannot add user'});
            }
        });


    },
// fonction de connexion 
    login: (req, res) => {
        var email = req.body.email
        var password = req.body.password

        if (email == null || password == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        asyncLib.waterfall([
            function (done)
            {
                models.User.findOne({
                    where:{ email : email}
                })
                    .then(function (useFound){
                        done(null,useFound)
                    })
                    .catch(function (err){
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    })
            },
            function (userFound,done)
            {
                if(userFound){
                    bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                }else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function(userFound, resBycrypt, done) {
                if(resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ],function(userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        })
    },

    gatAllProfile: function(req,res)
    {
       const test = models.User.findAll(
            {
               
                    //attributes: ['id']
            }
        )
        .then(function(user){
            res.status(200).send(user);
            let listId = []
            for (let i=0; i<user.length;i++){
                console.log(user[i].dataValues.id)
                listId.push(user[i].dataValues.id)
            }
            console.log(listId)

        })
        .catch(function(err){
            res.json(err);
        })
       
    },

    gatAllProfileClass: function(req,res)
    {
        var classId = parseInt(req.params.classId);
        asyncLib.waterfall([
            function (done)
            {
                models.InClass.findAll({
                    where:{ classId : classId}
                })
                    .then(function (useFound){
                        //res.send(useFound)
                        console.log(useFound)
                        done(null,useFound)

                    })
                    .catch(function (err){
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    })
            },
            function ( useFound,done)
            {   console.log(useFound)
                let listId = []
                for (let i=0; i<useFound.length;i++){
                    console.log(useFound[i].dataValues.userId)
                    listId.push(useFound[i].dataValues.userId)
                }
                console.log(listId)
                models.User.findAll(
                    {

                        where:{id : listId}
                    }
                )
                    .then(function(user){
                        res.status(200).send(user);
                        let listId = []
                        for (let i=0; i<user.length;i++){
                            console.log(user[i].dataValues.id)
                            listId.push(user[i].dataValues.id)
                        }
                        console.log(listId)

                    })
                    .catch(function(err){
                        res.json(err);
                    })
            }

        ])

    }
}