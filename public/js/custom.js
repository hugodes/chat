var pCount = 0;
var lpCount = 0;
var pseudo = "";

var socket = io();

$(document).ready(function () {
    polling_poll();
    long_polling_poll();
    push_poll();
    $('#myModal').modal('show');
});

/* Choix du pseudo */
$('#pseudo-button').click(function () {
    pseudo = $('#user-name').val();
});

/*Polling*/

function polling_poll () {
    setTimeout(function(){
        $.ajax({
         url : 'http://127.0.0.1:3000/polling_poll/',
         type : 'GET',
           data : {count: pCount},
           dataType : 'json',
           success: function(data, status){
               if (data.count){
                   pCount = data.count;
                   var elem = $('#polling-output');
                   elem.append(data.pseudo + '<div class="panel-body chat-messages" >' + data.message + '</div>');}
               polling_poll();
           },
           error: function  (resultat, status, error) {
               console.log(resultat.statusText);
           }
       });
    }, 1000);
}

function long_polling_poll () {

    $.ajax({
     url : 'http://127.0.0.1:3000/long_polling_poll/',
     type : 'GET',
       data : {count: lpCount},
       dataType : 'json',
       success: function(data, status){
           if (data.count){
               lpCount = data.count;
               var elem = $('#long-polling-output');
               elem.append(data.pseudo + '<div class="panel-body chat-messages" >' + data.message + '</div>');}
           long_polling_poll();
       },
       error: function  (resultat, status, error) {
           console.log(resultat.statusText);
       }
   });
};

function push_poll () {
    socket.on('chat_message', function(msg){
    var elem = $('#push-output');
    elem.append(msg.pseudo + '<div class="panel-body chat-messages" >' + msg.msg + '</div>');
    });
};

/*Send message*/

$('#polling-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        polling_send_message();
    }
});

$('#polling-button').click(function () {
    polling_send_message();
});


$('#long-polling-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        long_polling_send_message();
    }
});

$('#long-polling-button').click(function () {
    long_polling_send_message();
});

$('#push-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        push_send_message();
    }
});

$('#push-button').click(function () {
    push_send_message();
});


function polling_send_message () {
    var pmsg = $('#polling-input').val();

    $.ajax({
       url : 'http://127.0.0.1:3000/polling_send/',
       type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : {
        pmsg: pmsg,
        pseudo: pseudo},
    });
}

function long_polling_send_message () {
    var pmsg = $('#long-polling-input').val();

    $.ajax({
       url : 'http://127.0.0.1:3000/long_polling_send/',
       type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : {
        pmsg: pmsg,
        pseudo: pseudo},
    });
}

function push_send_message () {
    console.log('sending message via push');
    var pmsg = $('#push-input').val();
    socket.emit("push_send", {
        msg: pmsg,
        pseudo: pseudo});
}


