var express = require('express');
var apiRouter = require('./apiRouter')

var server = express();

server.use(express.json());

//test git

server.use('/api/', apiRouter)

server.listen(process.env.PORT || 3000, ()=>{
    console.log('Server en écoute');
});
