
//auth func

var token = function(login, pass, callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  var loginArgs = {
    data: {
      login: "380937531134",
      password: "veronika87"
    },
    headers: {
      "Content-Type": "application/json"
    }
  };
  client.post(
    "http://test-cab.planetakino.ua/mapiv2/login",
    loginArgs,
    function(data, response) {
      if (response.statusCode == 200) {
        console.log("status code:", response.statusCode);
        console.log("search result:", data.data.authToken);
        callback(data.data.authToken);
      } else {
        throw "Login failed :(";
      }
    }
  );
};

//theater func

var theater = function(callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  var loginArgs = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  client.get("http://cabinet.planetakino.ua/mapiv2/theater", loginArgs, function(data, response) {
      if (response.statusCode == 200) {
        //console.log("status code:", response.statusCode);
        //console.log("search result:", data);
        callback(data);
      } else {
	console.log(response.statusCode);
        //throw "Login failed :(";
      }
    }
  );
};



//http://cabinet.planetakino.ua/mapiv2/showtimes?theaterId=pk-lvov2&endDate=2017-09-16&startDate=2017-09-15


//showtimes

var showtimes = function(theaterId, start, end, callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  var loginArgs = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  client.get("http://cabinet.planetakino.ua/mapiv2/showtimes?theaterId="+theaterId+"&endDate="+end+"&startDate="+start, loginArgs, function(data, response) {
      if (response.statusCode == 200) {
        //console.log("status code:", response.statusCode);
//	console.log();
        //console.log("search result:", data.data.showTimes.length);
        callback(data);
      } else {
	console.log(response.statusCode);
        //throw "Login failed :(";
      }
    }
  );
};

/*
var request = require("request");
var values = require('object.values');

var loginArgs = { method: 'POST',
  url: 'http://test-cab.planetakino.ua/mapiv2/login',
  json: true,
  formData: { login: login, password: pass } };

request(loginArgs, function (error, response, body) {
  if (error) throw new Error(error);
var token = body.data;
  console.log(token);

});
}


*/
//showtimes('imax-kiev', '2017-09-15', '2017-09-16');
module.exports.showtimes = showtimes;
module.exports.theater = theater;
module.exports.token = token;

