
var token = function(login, pass, callback) {
    var Client = require('node-rest-client').Client;
var querystring = require('querystring');
 
// form data

    //this.tempt_session = session;

    client = new Client();

    // Provide user credentials, which will be used to log in to JIRA.

    var loginArgs = {
	data: {
 	
            login: "380937531134",
            password: "veronika87"
        },
        headers: {
            "Content-Type": "application/json",
        }       

    };

    client.post("http://test-cab.planetakino.ua/mapiv2/login", loginArgs, function(data, response) {
        if (response.statusCode == 200) {

            
            // Get the session information and store it in a cookie in the header
                            /*     data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                                jql: "project='BOT'"
                        }*/
            
            // Make the request return the search results, passing the header information including the cookie.
            /*  client.post("http://planetakino.atlassian.net/rest/api/2/project", searchArgs, function(searchResult, response) {
                        console.log('status code:', response.statusCode);
                        console.log('search result:', searchResult.length);
      var i=searchResult.length;
         searchResult.forEach(function(item, i, searchResult) { console.log( searchResult[i].name );});
                        console.log('search result:', searchResult[1].name);
                });*/
                        console.log('status code:', response.statusCode);
                        console.log('search result:', data.data.authToken);
callback(data.data.authToken);
        } else {
            throw "Login failed :(";
        }

    });

}


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


module.exports.token = token;

