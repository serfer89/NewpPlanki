//auth func
var fs = require("fs");

var token = function(login, pass, callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  //console.log("login="+login+" pass="+pass)
  var loginArgs = {
    data: {
      login: login,
      password: pass
    },
    headers: {
      "Content-Type": "application/json"
    }
  };
  client.post(
    "http://test-cab.planetakino.ua/mapiv2/login",
    loginArgs,
    function(data, response) {
      if (response.statusCode == 200 && data.code == "1") {
        console.log("status code:", response.statusCode);
        console.log("search result:", data.data.authToken);
        //console.log(data.code);
        callback(data.data.authToken);
      } else {
        callback(-1);
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
  client.get(
    "http://cabinet.planetakino.ua/mapiv2/theater",
    loginArgs,
    function(data, response) {
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
  //console.log(theaterId + start + end);
  var Client = require("node-rest-client").Client;
  client = new Client();
  var loginArgs = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  client.get(
    "http://cabinet.planetakino.ua/mapiv2/showtimes?theaterId=" +
    theaterId +
    "&endDate=" +
    end +
    "&startDate=" +
    start,
    loginArgs,
    function(data, response) {
      if (response.statusCode == 200) {
        //console.log("status code:", response.statusCode);
        //  console.log();
        //console.log("search result:", data.data.showTimes.length);
        //callback(data);
      } else {
        console.log(response.statusCode);
        //throw "Login failed :(";
      }
      callback(data);
    }
  );
};

var films = function(id, theater, callback) {
  console.log("films_con " + id + theater);
  var Client = require("node-rest-client").Client;

  client = new Client();
  var searchArgs = {
    headers: {
      // Set the cookie from the session information
      "Content-Type": "application/json"
    }
  };

  client.get(
    "http://cabinet.planetakino.ua/mapiv2/movies?theaterId=" + theater,
    searchArgs,
    function(searchResult, response) {
      console.log("status code:", response.statusCode);
      console.log(
        "search result:",
        searchResult.data.theaters[0].theatre_movies.inTheaters.movies.length
      );
      //var i=searchResult.length;
      //searchResult.forEach(function(item, i, searchResult) { console.log( searchResult[i].name );});
      //console.log('search result:', searchResult[1].name);
      /* --save to file   var json_file = JSON.stringify(searchResult);
      fs.writeFile("./movies/"+theater+"_movie.json", json_file, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); */
      callback(searchResult);
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
module.exports.films = films;
