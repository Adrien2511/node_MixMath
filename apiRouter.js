
var express = require('express');
var usersCtrl = require('./routes/usersCtrl')
var classCtrl = require('./routes/classCtrl')
var duelCtrl = require('./routes/duelCtrl')

const apiRouter = express.Router()

//user
apiRouter.post('/users/register',usersCtrl.register);
apiRouter.post('/users/login/',usersCtrl.login);
apiRouter.get('/users/all',usersCtrl.gatAllProfile);
apiRouter.get('/users/allClass/:classId',usersCtrl.gatAllProfileClass);

//class
apiRouter.post('/class/register',classCtrl.register);
apiRouter.post('/class/join',classCtrl.join);

//duel
apiRouter.post('/duel/create',duelCtrl.createDuel);
apiRouter.get('/duel',duelCtrl.Duel);

module.exports=apiRouter
