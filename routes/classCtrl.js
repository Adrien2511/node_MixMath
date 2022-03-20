var bcrypt = require('bcrypt');
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');

module.exports=
    {
        register:function (req,res)
        {   //avoir le titre de la personne
            var headerAuth  = req.headers['authorization'];
            var userAdmin      = jwtUtils.getUserAdmin(headerAuth);

            //variables
            var name = req.body.name
            var password = req.body.password

            // vérifier que c'est un prof
            if(userAdmin)
            {
                //création de la classe
                models.Class.create(
                    {
                        name: name,
                        password : password
                    }
                )
                    .then(function(classe){
                        res.status(200).send(classe)

                    })
                    .catch(function(err){
                        res.json(err);
                    })
            }
            else
            {
                res.status(400).json({'erro': 'pas le droit'})
            }
        }
    }