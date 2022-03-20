
var express = require('express');
var usersCtrl = require('./routes/usersCtrl')


const apiRouter = express.Router()

apiRouter.post('/users/register',usersCtrl.register);
apiRouter.post('/users/login/',usersCtrl.login);

module.exports=apiRouter
