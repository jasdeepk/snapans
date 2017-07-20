var express = require('express')
  , logger = require('morgan')
  , app = express()
  , http = require('http').Server(app)
  , io = require('socket.io')(http)
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade');

app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res, next) {
  try {
    io.emit('some event', { for: 'everyone'});
    var html = template({ title: 'Home' });
    res.send(html);
  } catch (e) {
    next(e);
  }
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
})