var express = require('express')
var app = express()
var messages = ['Welcome to the server:']
var bodyParser = require('body-parser')
var requests = [];


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/polling_poll/', function(req, res) {
    var reqCount = parseInt(req.query.count);
    console.log(reqCount);
    if (reqCount < messages.length) {
        res.send({
            count: reqCount+1,
            message: messages[reqCount]});
    }
    else {
        res.send({});
    };
})

app.get('/long_polling_poll/', function(req, res) {
    console.log("Im here");
    var reqCount = parseInt(req.query.count);
    console.log(reqCount);
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

app.post('/long_polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    messages.push(msg);
    res.end();
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
})


app.post('/polling_send/', function(req, res) {
    var msg = req.body.pmsg;
    messages.push(msg);
    res.end();
})

app.listen(3000)