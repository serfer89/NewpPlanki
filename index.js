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
var cur_theatre;
var cur_theatre_id;
var chat_id;
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

function start(msg) {
  chat_id = msg.from.id;
  if (cur_theatre == "" || cur_theatre == null) {
    get_theatre(msg);
  } else {
    films(chat_id, cur_theatre_id);
  }
}

function get_theatre(msg) {
  "use strict";
  var theatre_but = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
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
        start(msg);
      }
    });
  });
}

function films(id, theater) {
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
          response.data.theaters[0].theatre_movies.inTheaters.movies[i].id
        }
      ]);
    }

    console.log(response.data.theaters[0].theatre_movies.inTheaters.movies.length);
    var jira_films = {
      reply_markup: JSON.stringify({
        inline_keyboard: but_films
      })
    };
    let mes_text = "Обирай фільм";
    bot.sendMessage(id, mes_text, jira_films);
  });
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
      console.log(msg_1);
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

function today() {
  var now = new Date();
  var startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  var timestamp = startOfDay / 1000 - 10800; // GMT+3
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

  for (var i = 0; i < 4; i++) {
    switch (i) {
      case 0:
        date_but.push([{ text: u_to_js(timestamp) }]);
        break;
      case 1:
        date_but.push([{ text: u_to_js(timestamp + 86400) }]);
        break;
      case 2:
        date_but.push([{ text: u_to_js(timestamp + 86400 * 2) }]);
        break;
      case 3:
        date_but.push([{ text: u_to_js(timestamp + 86400 * 3) }]);
        break;
             }
  }

  console.log(date_but);
  return date_but;
}

today();

var getshowtimes = auth.showtimes(theaterId, startDate, endDate, function(
                                  response
) {
  console.log("Сьогодні - " + response.data.showTimes.length + " сеанси");
});

bot.onText(/\/start/, function(msg, match) {
  console.log("start");

  if (cur_theatre == "" || cur_theatre == null) {
    get_theatre(msg);
  } else {
    console.log(cur_theatre);
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

