const TelegramBot = require("node-telegram-bot-api");
var auth = require("./con.js");
var regex = require("regex-email");
// replace the value below with the Telegram token you receive from @BotFather
const token = "438526782:AAF4JxfUKnhbd2HKe0k-DcMOkUJiXlsLEzc";
var login;
var pass;
var counter = 0;
var pass_fail = 1;
var authToken;
var startDate;
var endDate;
var date_but = [];
var cur_day;
var cur_day_system;
var cur_theatre;
var cur_theatre_id;
var chat_id;
var cur_movieName;
var cur_showtime;
var change_but; // кнопки для зміни дати або кінотеатру
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"

/*var getToken = auth.token(login, pass, function(response) {
  console.log("authToken = " + response);
  authToken = response;
});*/
/*var theatre_arr=[];
var getTheaters = auth.theater(function(response) {
  "use strict";
  console.log(response.data.length);
  for (var i = 0; i < response.data.length; i++) {
    for (var x = 0; x < response.data[i].theater.length; x++) {


            theatre_arr.push([
        {
          text:
          response.data[i].theater[x].id
        }
      ]);

    }
  }      console.log(theatre_arr);
});



[ [ { text: 'pk-lvov2' } ],
  [ { text: 'pk-lvov' } ],
  [ { text: 'imax-kiev' } ],
  [ { text: 'pk-odessa2' } ],
  [ { text: 'pk-odessa' } ],
  [ { text: 'pk-sumy' } ],
  [ { text: 'pk-kharkov' } ] ]

*/
function showtimes(msg, uid, cur_day){
console.log(cur_movieName);
        cur_day_system = cur_day.split(", ");
        cur_day_system_right = cur_day_system[1].split(".");
        var now = new Date(); 
        cur_day_system = now.getFullYear()+"-"+cur_day_system_right[1]+"-"+cur_day_system_right[0];
        console.log(cur_day_system);

  var now = new Date(cur_day_system);
  var endDate = new Date(
    now.getFullYear(),
    now.getMonth()+1,
    now.getDate()+1 
  );
  endDate = endDate.getFullYear()+"-"+endDate.getMonth()+"-"+endDate.getDate();

  var getshowtimes = auth.showtimes(cur_theatre_id, cur_day_system, endDate, function(
                                  response
) {
  console.log("Сьогодні - " + response.data.showTimes.length + " сеанси");
for (var i= 0; i < response.data.showTimes.length; i++)
{

  if (response.data.showTimes[i].movieId == uid)
  {
    console.log(response.data.showTimes[i].timeBegin);
  }
}

});

console.log(chat_id+uid+cur_day_system);

}
function start(msg) {


  msg.reply_to_message = "";



  chat_id = msg.from.id;
  if (cur_theatre == "" || cur_theatre == null) {
console.log("start-get_theatre");
    get_theatre(msg);
  } 
  if (cur_day=="" || cur_day == null)
    { console.log("get day");
      today(msg);}
  else {

    change_but = {
    parse_mode: "Markdown",
    reply_markup: {

      resize_keyboard: true,
      keyboard: [ [ { text: 'Змінити кінотеатр', callback:  "theater_"},
  { text: 'Змінити дату', callback: "date_"}], 
  [{text: 'Назад', callback: "back_"}]
      ]
    }
  };
bot.sendMessage(chat_id,  "Зачекай, шукаю Фільми... ", change_but)
    films(chat_id, cur_theatre_id);}
console.log("start func");

 /* else {




var change_but = {
    parse_mode: "Markdown",
    reply_markup: {

      resize_keyboard: true,
      keyboard: [ [ { text: 'Змінити кінотеатр', callback:  "theater_"},
  { text: 'Змінити дату', callback: "date_"}], 
	[{text: 'Назад', callback: "back_"}]
      ]
    }
  };

var msg_text = "Фільми в "+cur_theatre;
  bot.sendMessage(chat_id,  msg_text, change_but)

    .then(function(sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    console.log(
      "sended.message_id = " +
      sended.message_id +
      " msg.from.id=" +
      msg.message_id
    );
    console.log(sended);

    bot.on("message", msg_1 => {
      msg_1.reply_to_message = sended;
      console.log("QWEQWE"+msg_1);
 _msgTxt = msg_1.text,
            msgTxt = _msgTxt.toLowerCase();
console.log(msgTxt);
switch (msgTxt){
case 'змінити дату':
today(msg);
break;
case 'змінити кінотеатр':
get_theatre(msg);
break;
}
    });
    bot.onReplyToMessage(chatId, messageId, function(message) {
      if (message.message_id - messageId == 1) {
        //console.log(opts);

        console.log("OK. I'll search for %s", message.text);
            _msgTxt = message.text,
            msgTxt = _msgTxt.toLowerCase();
console.log(msgTxt);
switch (msgTxt){
case 'змінити дату':
today(msg);
break;
case 'змінити кінотеатр':
get_theatre(msg);
break;
}

        start(msg);return;
      }

else {console.log("loop1");start(msg);return;}
    });
  });

    films(chat_id, cur_theatre_id);
  }*/





}

function get_theatre(msg) {
  "use strict";

  var theatre_but = {
    parse_mode: "Markdown",
    reply_markup: {

      resize_keyboard: true,
      keyboard: [
        [{ text: "Львів (Forum Lviv)" }, { text: "Львів (King Cross)" }],
        [{ text: "Київ" }, { text: "Одеса (Таїрова)" }],
        [{ text: "Одеса (Котовського)" }, { text: "Суми" }],
        [{ text: "Харків" }]
      ]
    }
  };
  var fromId = msg.from.id;
  bot
    .sendMessage(fromId, "Обери кінотеатр", theatre_but)
    .then(function(sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    console.log(
      "sended.message_id = " +
      sended.message_id +
      " msg.from.id=" +
      msg.message_id
    );
    console.log(sended);

    bot.on("message", msg_1 => {
      msg_1.reply_to_message = sended;
      console.log(msg_1);
    });
    bot.onReplyToMessage(chatId, messageId, function(message) {
      if (message.message_id - messageId == 1) {
        //console.log(opts);

        console.log("OK. I'll search for %s", message.text);
        cur_theatre = message.text;
        switch (cur_theatre) {
          case "Львів (Forum Lviv)":
            cur_theatre_id = "pk-lvov2";
            break;

          case "Львів (King Cross)":
            cur_theatre_id = "pk-lvov";
            break;

          case "Київ":
            cur_theatre_id = "imax-kiev";
            break;

          case "Одеса (Таїрова)":
            cur_theatre_id = "pk-odessa2";
            break;

          case "Одеса (Котовського)":
            cur_theatre_id = "pk-odessa";
            break;

          case "Суми":
            cur_theatre_id = "pk-sumy";
            break;

          case "Харків":
            cur_theatre_id = "pk-kharkov";
            break;
                           }
        start(msg);return;
      }

else {console.log("loop1"); 
      msg_1.reply_to_message = ""; 
      start(msg);return;}
    });
  });


}

function films(id, theater) {
  //if (theater == "" || theater == null){}
  "use strict";
  console.log("films started");
  get_films = auth.films(id, theater, function(response) {
    var but_films = []; //

    for (
      var i = 0;
      i < response.data.theaters[0].theatre_movies.inTheaters.movies.length;
      i++
    ) {
      console.log(
        response.data.theaters[0].theatre_movies.inTheaters.movies[i].name
      );

      but_films.push([
        {
          text:
          response.data.theaters[0].theatre_movies.inTheaters.movies[i].name,
          callback_data:
          "filmid_" +
          response.data.theaters[0].theatre_movies.inTheaters.movies[i].uid
        }
      ]);
    }

    console.log(response.data.theaters[0].theatre_movies.inTheaters.movies.length);

    /* var allfilms_but = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      resize_keyboard: true,
      keyboard: but_films }
  };*/

    var allfilms_but = {
      reply_markup: JSON.stringify({
        inline_keyboard: but_films
      })
    };
    let mes_text = "Обирай фільм "+ "в "+cur_theatre+" "+cur_day;
    bot.sendMessage(id, mes_text, allfilms_but);
  });
return;
}

function getLP(msg) {
  var fromId = msg.from.id;
  bot
    .sendMessage(fromId, "Введи номер телефону або пошту:")
  //bot.on("message", msg_1 => {msg_1.reply_to_message = msg; console.log(msg_1)});
    .then(function(sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    console.log(
      "sended.message_id = " +
      sended.message_id +
      " msg.from.id=" +
      msg.message_id
    );
    console.log(sended);

    bot.on("message", msg_1 => {
      msg_1.reply_to_message = sended;
      console.log("getLP"+msg_1);
    });
    bot.onReplyToMessage(chatId, messageId, function(message) {
      if (message.message_id - messageId == 1) {
        //console.log(opts);

        console.log("OK. I'll search for %s", message.text);
        login = message.text;
        bot.sendMessage(fromId, "Введи пароль:").then(function(sended) {
          var chatId = sended.chat.id;
          var messageId = sended.message_id;
          bot.on("message", msg_1 => {
            msg_1.reply_to_message = sended;
          });
          bot.onReplyToMessage(chatId, messageId, function(message) {
            console.log("OK. I'll search for %s", message.text);
            pass = message.text;
            if (login != null || login != "") {
              var getToken = auth.token(login, pass, function(response) {
                console.log("authToken = " + response);
                authToken = response;
                //console.log(authToken);
                if (authToken < 0) {
                  bot.sendMessage(
                    chatId,
                    "Ой-ой Ти щось не вірно ввів, спробуй ще"
                  );
                  getLP(msg);
                } else {
                  bot.sendMessage(chatId, "Все ок, поїхали далі");
                  return authToken;
                }
              });
            } else {
              bot.sendMessage(
                chatId,
                "Ой-ой Ти щось не вірно ввід, спробуй ще"
              );
            }
          });
        });
      } else {
        console.log("loop");
      }
    });
  });
}

var theaterId = "imax-kiev";

function today(msg) {
  //console.log("today_func - start");
  c_date="";
  var now = new Date();
  var startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() 
  );
  var timestamp = startOfDay / 1000 ; // GMT+3
  var next_day = timestamp + 86400;
  var next2_day = next_day + 86400;
  var next3_day = next2_day + 86400;
  console.log(timestamp);
  console.log(timestamp + 86400);

  function u_to_js(timestamp) {
    var date = new Date(timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();
    if (month < 10) {
      month = "0" + month;
    }
    var date = date.getDate();
    if (date < 10) {
      date = "0" + date;
    }
    switch (day) {
      case 0:
        day = "Неділя";
        break;
      case 1:
        day = "Понеділок";
        break;

      case 2:
        day = "Вівторок";
        break;

      case 3:
        day = "Середа";
        break;

      case 4:
        day = "Четвер";
        break;

      case 5:
        day = "П'ятниця";
        break;

      case 6:
        day = "Субота";
        break;
               }
    var c_date = day + ", " + date + "." + month;
    return c_date;
  }

  console.log(u_to_js(timestamp));
var i=0;
  for (i = 0; i < 4; i++) {
    switch (i) {
      case 0:
        date_but.push([{ text: u_to_js(timestamp),
          callback_data: "date_"+u_to_js(timestamp) }]);
        break;
      case 1:
        date_but.push([{ text: u_to_js(timestamp + 86400),
          callback_data: "date_"+u_to_js(timestamp + 86400) }]);
        break;
      case 2:
        date_but.push([{ text: u_to_js(timestamp + 86400 * 2),
          callback_data: "date_"+u_to_js(timestamp + 86400 * 2) }]);
        break;
      case 3:
        date_but.push([{ text: u_to_js(timestamp + 86400 * 3),
          callback_data: "date_"+u_to_js(timestamp + 86400 * 3) }]);
        break;
             }
  }
  console.log(date_but);
    var dates_but = {
    parse_mode: "Markdown",
    reply_markup: {
      
      resize_keyboard: true,
      keyboard: date_but }
  };

    /*var dates_but = {
      reply_markup: JSON.stringify({
        inline_keyboard: date_but
      })
    };*/

    bot.sendMessage(chat_id, "Обери дату", dates_but)
    .then(function(sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    console.log("sended.message_id = " + sended.message_id +" msg.from.id=" + msg.message_id);
    //console.log(sended);

    bot.on("message", msg_1 => {
      msg_1.reply_to_message = sended;
      //console.log(msg_1);
    });
    bot.onReplyToMessage(chatId, messageId, function(message) {
      if (message.message_id - messageId == 1) {
        //console.log(opts);
        console.log("OK. I'll search for %s", message.text);
        cur_day = message.text;
        sended.reply_to_message = "";
        start(msg);return;
      }
else {console.log("loop2"); 
      //msg_1.reply_to_message = ""; 
      //start(msg);
      return;}
    });
  });



}




bot.onText(/\/chek/, function(msg, match) {
  console.log(cur_day);})
bot.onText(/\/start/, function(msg, match) {
  console.log("start");
  chat_id = msg.from.id;
  if (cur_theatre == "" || cur_theatre == null) {
    get_theatre(msg);
  } else {
    console.log(cur_theatre);
    films(chat_id, cur_theatre_id);
  }

  /*
  const id = msg.from.id;
  if (authToken == null || authToken == "") {
    var pre_auth = {
      parse_mode: "Markdown",
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "Логін"
            }
          ],
          ["Я просто подивлюсь"]
        ]
      }
    };


var date_but = {
      parse_mode: "Markdown",
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: date_but
      }
    };

    bot.sendMessage(id, "Для продовження авторизуйся", pre_auth);
    bot.on("message", function(msg) {
      const id = msg.from.id,
            _msgTxt = msg.text,
            msgTxt = _msgTxt.toLowerCase();
      //console.log(msg);
      console.log("All text to console " + msgTxt);
      if (msgTxt == "логін") {
        getLP(msg);

        counter++;

        //getname(msgTxt, id);
      } else if (msgTxt == "я просто подивлюсь") {
        bot.sendMessage(id, "Без авторизації Ти не зможеш купти квиток.");
        films(id, "imax-kiev");
      }

      console.log("Counter - " + counter);
    });

  } else {
    console.log(authToken);
  }*/
});
bot.on("message", function(msg) {

  var msg_text = msg.text;
  switch (msg_text){
   case "Змінити дату":
   console.log("Змінити дату");
today(msg);
break;
case "Змінити кінотеатр":
console.log("Змінити кінотеатр");
get_theatre(msg);
break;
case "Назад":
console.log("Назад");
start(msg);
  }
}

  )
bot.on("callback_query", function(msg) {
  "use_strict";
  chat_id = msg.from.id;
  var answer = msg.data;
  var res = answer.split("_");
  console.log(res[0]+res[1]);

  switch (res[0]) {
    case "filmid":
    console.log(res[2]);
      cur_movieName = res[2];
      showtimes(msg, res[1], cur_day);
      break;
    case "date":
      cur_day = res[1];
      break;
    
                }
});





/*
bot.onText(/\/start (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
console.log("1");
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.

bot.on("message", msg => {
  const chatId = msg.chat.id;
console.log("2");
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, msg.text);
});*/

