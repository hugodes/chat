var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var messages = ['Welcome to the server:']
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
            message: messages[reqCount]});
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
            message: messages[reqCount]});
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
        messages.push(msg);
        push_new_message(msg);
    });

});


/*
 * Sending operations for all types
*/

// Polling
app.post('/polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    messages.push(msg);
    res.end();
    push_new_message(msg);
});


// Long polling
app.post('/long_polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    messages.push(msg);
    res.end();
    long_polling_send();
    push_new_message(msg);
    });

function long_polling_send () {
    while (requests.length){
        var client = requests.pop()
        var res = client['res'];
        var count = client['count']
        if (count < messages.length) {
            res.send({
                count: count+1,
                message: messages[count]});
        }
        else {
            res.send({});
        };
    };
}

//push
function push_new_message(msg) {
    io.emit('chat_message', msg);
    console.log('Jenvoi le message à tous');
    long_polling_send();
};



