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
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"

/*var getToken = auth.token(login, pass, function(response) {
  console.log("authToken = " + response);
  authToken = response;
});*/

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
                  bot.sendMessage(
                    chatId,
                    "Все ок, поїхали далі"
                  ); 
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

var getTheaters = auth.theater(function(response) {
  console.log(response.data.length);
  for (var i = 0; i < response.data.length; i++) {
    for (var x = 0; x < response.data[i].theater.length; x++) {
      console.log(response.data[i].theater[x].name);
    }
  }
});

var theaterId = "imax-kiev";

function today()

{



var now = new Date();
var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
var timestamp = (startOfDay) / 1000;
console.log(timestamp);

function u_to_js(timestamp)
{
var date = new Date(timestamp*1000);
var year=date.getFullYear();
var month = date.getMonth()+1; if (month < 10) {month = "0"+month;}
var date = date.getDate();
var c_date = year+"-"+month+"-"+date;
return c_date;
}

console.log(u_to_js(timestamp));
}

today();


var getshowtimes = auth.showtimes(theaterId, startDate, endDate, function(
                                  response
) {
  console.log("Сьогодні - " + response.data.showTimes.length + " сеанси");
});

bot.onText(/\/start/, function(msg, match) {
  console.log("start");
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
      }

      console.log("Counter - " + counter);
    });
    /*
bot.onText("Логін", function(msg, match){
  bot.sendMessage(id, "Введи номер телефону або пошту:");
	});*/
  } else {
    console.log(authToken);
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

