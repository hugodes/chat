var pCount = 0;
var lpCount = 0;


$(document).ready(function () {
    polling_poll();
    long_polling_poll();
    var socket = io();
});

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
                   console.log(pCount);
                   var elem = $('#polling-output');
                   elem.append('<div class="panel-body chat-messages" >' + data.message + '</div>');}
               polling_poll();
           },
           error: function  (resultat, status, error) {
               console.log(resultat.statusText);
           }
       });
    }, 1000);
}

function long_polling_poll () {
    console.log("yolo");

    $.ajax({
     url : 'http://127.0.0.1:3000/long_polling_poll/',
     type : 'GET',
       data : {count: lpCount},
       dataType : 'json',
       success: function(data, status){
           if (data.count){
               lpCount = data.count;
               console.log(lpCount);
               var elem = $('#long-polling-output');
               elem.append('<div class="panel-body chat-messages" >' + data.message + '</div>');}
           long_polling_poll();
       },
       error: function  (resultat, status, error) {
           console.log(resultat.statusText);
       }
   });
};




$('#polling-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        polling_send_message();
    }
});

$('#polling-button').click(function () {
    polling_send_message();
    console.log('jenvoie un message');
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


function polling_send_message () {
    var pmsg = $('#polling-input').val();
    console.log($('#polling-input').val())

    $.ajax({
       url : 'http://127.0.0.1:3000/polling_send/',
       type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : {pmsg: pmsg},
    });
}

function long_polling_send_message () {
    var pmsg = $('#long-polling-input').val();
    console.log($('#long-polling-input').val())

    $.ajax({
       url : 'http://127.0.0.1:3000/long_polling_send/',
       type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : {pmsg: pmsg},
    });
}



