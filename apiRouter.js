var express = require('express');
var usersCtrl = require('./routes/usersCtrl')
var classCtrl = require('./routes/classCtrl')
var duelCtrl = require('./routes/duelCtrl')
var replyCtrl = require('./routes/replyCtrl')
var playerCtrl = require('./routes/playerCtrl')
var resultCtrl = require('./routes/resultCtrl')

const apiRouter = express.Router()

//user
apiRouter.post('/users/register', usersCtrl.register);
apiRouter.post('/users/login/', usersCtrl.login);
apiRouter.get('/users/all', usersCtrl.gatAllProfile);
apiRouter.get('/users/allClass/:classId', usersCtrl.gatAllProfileClass);

//class
apiRouter.post('/class/register', classCtrl.register);
apiRouter.post('/class/join', classCtrl.join);
apiRouter.get('/class/all',classCtrl.getAllClass);
apiRouter.delete('/class/delete/student/:studentId/:classId',classCtrl.deleteStudent);
apiRouter.delete('/class/delete/:classId',classCtrl.deleteClass)

//duel
apiRouter.post('/duel', duelCtrl.Duel);
apiRouter.get('/duel/all',duelCtrl.getAllDuel);

//reply
apiRouter.get('/reply/all',replyCtrl.getAllReply);
apiRouter.delete('/reply/delete/:replyId',replyCtrl.delete);

//player
apiRouter.post('/player/create',playerCtrl.create);

//result
apiRouter.get('/result/my',resultCtrl.myResult);
apiRouter.get('/result/all',resultCtrl.allResult);
apiRouter.get('/result/student/:userId',resultCtrl.studentResult);

module.exports = apiRouter
