var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var messages = [{
    msg: 'Welcome to the server:',
    pseudo: 'server'}];
var bodyParser = require('body-parser')
var requests = [];


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/public'));


/*
 * Polling operations for all types
*/

//polling
app.get('/polling_poll/', function(req, res) {
    var reqCount = parseInt(req.query.count);
    if (reqCount < messages.length) {
        res.send({
            count: reqCount+1,
            message: messages[reqCount].msg,
            pseudo: messages[reqCount].pseudo});
    }
    else {
        res.send({});
    };
})

// long polling
app.get('/long_polling_poll/', function(req, res) {
    var reqCount = parseInt(req.query.count);
    if (reqCount < messages.length) {
        res.send({
            count: reqCount+1,
            message: messages[reqCount].msg,
            pseudo: messages[reqCount].pseudo});
    }
    else {
        requests.push({
            res: res,
            count: reqCount,
        });
    };
})


//Push
io.on('connection', function(socket){
  console.log('a user connected');

    socket.on('push_send', function(msg) {
        console.log('recieving push sent message');
        messages.push({
            msg: msg.msg,
            pseudo: msg.pseudo});
        push_new_message(msg.msg, msg.pseudo);
    });

});


/*
 * Sending operations for all types
*/

// Polling
app.post('/polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    var pseudo = req.body.pseudo;
    messages.push({
        msg: msg,
        pseudo: pseudo});
    res.end();
    push_new_message(msg, pseudo);
});


// Long polling
app.post('/long_polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    var pseudo = req.body.pseudo;
    messages.push({
        msg: msg,
        pseudo: pseudo});
    res.end();
    long_polling_send();
    push_new_message(msg, pseudo);
    });

function long_polling_send () {
    while (requests.length){
        var client = requests.pop()
        var res = client['res'];
        var count = client['count']
        if (count < messages.length) {
            res.send({
                count: count+1,
                message: messages[count].msg,
                pseudo: messages[count].pseudo});
        }
        else {
            res.send({});
        };
    };
}

//push
function push_new_message(msg, pseudo) {
    io.emit(
        'chat_message',
        {
            msg: msg,
            pseudo: pseudo});
    console.log('Jenvoi le message à tous');
    long_polling_send();
};



