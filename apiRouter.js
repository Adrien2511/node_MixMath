
var express = require('express');
var usersCtrl = require('./routes/usersCtrl')
var classCtrl = require('./routes/classCtrl')


const apiRouter = express.Router()

apiRouter.post('/users/register',usersCtrl.register);
apiRouter.post('/users/login/',usersCtrl.login);
apiRouter.get('/users/all',usersCtrl.gatAllProfile);

apiRouter.post('/class/register',classCtrl.register)

module.exports=apiRouter
