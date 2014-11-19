var pCount = 0;


$(document).ready(function () {
    polling_poll();
    //poll();
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
    var params = {
        count: lpCount
    };



    $.ajax({
     url : 'http://127.0.0.1:3000/long_polling/poll/',
     type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : JSON.stringify(params),
       dataType : 'json',
       success: function(data, status){
           var mydata = data;
           lpCount = mydata.count;
           console.log(lpCount);
           var elem = $('#long-polling-output');
           elem.text(elem.text() + mydata.foo);
           poll();
       },
       error: function  (resultat, status, error) {
           //console.log(resultat.statusText);
       }
   });
}

$('#long-polling-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        sendMessageLP();
    }
});

$('#long-polling-button').click(function () {
    sendMessageLP();
});

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



function polling_send_message () {
    var pmsg = $('#polling-input').val();
    console.log($('#polling-input').val())

    $.ajax({
       url : 'http://127.0.0.1:3000/polling_send/',
       type : 'POST', // Le type de la requête HTTP, ici devenu POST
       data : {pmsg: pmsg},
    });
}

