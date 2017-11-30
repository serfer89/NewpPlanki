//auth func
var fs = require("fs");
//var http = require("http");
//var webshot = require("webshot");
var free_schem = [];
var best_places_row = [];
var best_places_seat = [];

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

function getClosestNum(num, ar) {
  var i = 0,
      closest,
      closestDiff,
      currentDiff;
  if (ar.length) {
    closest = ar[0];
    for (i; i < ar.length; i++) {
      closestDiff = Math.abs(num - closest);
      currentDiff = Math.abs(num - ar[i]);
      if (currentDiff < closestDiff) {
        closest = ar[i];
      }
      closestDiff = null;
      currentDiff = null;
    }
    //returns first element that is closest to number
    return closest;
  }
  //no length
  return false;
}

var bestSeats = function(theatreid, showtimeid, count) {
 
    var request = require("request-promise");
    var data1;
    var uniq_row = [];
    var arr_row = [];
    var arr_seat = [];
    var best_row;
    var best_seat;
    var full_schem = [];
    var full_length;
    var fn_row = [];
    var fn_seat = [];
    var loginArgs = {
      headers: {
        "Content-Type": "application/json",
        "Image-Scale": "2"
      }
    };

    request(
      "http://test-cab.planetakino.ua/mapiv2/halls?showTimeid=" + showtimeid
    )
      .then(function(data) {
      data1 = JSON.parse(data);

      return request(
        "http://test-cab.planetakino.ua/mapiv2/geometricsHallSheme?theaterId=" +
        theatreid,
        loginArgs
      );
    })
      .then(function(data) {
      data2 = JSON.parse(data);
 try {
      for (var i = 0; i < data2.data.geometricsHallSheme.length; i++) {
        if (
          data2.data.geometricsHallSheme[i].hallid ==
          data1.data.hallsSheme[0].hallId
        ) {
          for (
            var x = 0;
            x < data2.data.geometricsHallSheme[i].seats.length;
            x++
          ) {
            full_schem.push(data2.data.geometricsHallSheme[i].seats[x].id);
            arr_row.push(data2.data.geometricsHallSheme[i].seats[x].row);

            uniq_row = Array.from(new Set(arr_row));
            uniq_row.sort(function(a, b) {
              return a - b;
            });
            best_row = Math.max(...uniq_row) / 2 - 1;
            best_row = uniq_row[parseFloat(best_row.toFixed(0))];

            if (data2.data.geometricsHallSheme[i].seats[x].row == best_row) {
              arr_seat.push(data2.data.geometricsHallSheme[i].seats[x].seat);
            }
          }

          //console.log( arr_seat);
          uniq_seat = Array.from(new Set(arr_seat));
          uniq_seat.sort(function(a, b) {
            return a - b;
          });
          best_seat = Math.max(...uniq_seat) / 2 - 1;
          best_seat = uniq_seat[parseFloat(best_seat.toFixed(0))];
          console.log(
            "uniq seats- " + uniq_seat.length + " best_seat " + best_seat
          );

          console.log(best_row);
          console.log(
            "uniq rows- " + uniq_row.length + " best_row " + best_row
          );

          full_length = data2.data.geometricsHallSheme[i].seats.length;
        }
      }
        } catch (err) {
    console.log(err);
  }
try {
      if (data1.data.hallsSheme[0].busySeats != null) {
        Array.prototype.diff = function(a) {
          return this.filter(function(i) {
            return a.indexOf(i) < 0;
          });
        };

        var result_ar = full_schem.diff(data1.data.hallsSheme[0].busySeats);
      } else var result_ar = full_schem.diff(data1.data.hallsSheme[0].emptySeats);

      console.log(
        "Hall ID",
        data1.data.hallsSheme[0].hallId,
        "Full shema",
        result_ar.length
      );
      console.log(full_length);
}
       catch (err) {
    console.log(err);
  }
      function get_places(result) {
        try {
        var re = new RegExp("^[a-zA-Z].*$");
        re = re.test(result[3]);
        //console.log(result[3]);

        for (var i = 0; i < result.length; i++) {
          if (re == false) {
            result[i] = parseFloat(result[i]) / 100000;
            result[i] = result[i].toString();
            result[i] = result[i].split(".000");

            best_places_row.push(result[i][0]);
            for (var x = 0; x < 100; x++) {
              if (result[i][0] == x) {
                //console.log(result[i][0]+"--"+x);
                //x = parseInt(x);
                var r = parseInt(result[i][0]);
                if (result[i][1] == "1") {
                  result[i][1] = 10;
                }
                if (result[i][1] == "2") {
                  result[i][1] = 20;
                }
                if (result[i][1] == "3") {
                  result[i][1] = 30;
                }
                fn_seat[i] = {
                  row: parseInt(result[i][0]),
                  seat: parseInt(result[i][1])
                };
                console.log(fn_seat[0]);

                fn_row.push(r);

                //console.log(result[i][0]+"-"+result[i][1]);
              }
              //else {console.log(x +" = "+ result[i][0]);}
            }

            uniq_row2 = Array.from(new Set(fn_row));
            uniq_row2.sort(function(a, b) {
              return a - b;
            });
            //console.log(uniq_row2);
            if (uniq_row2.length < 5) {
              best_row = (Math.max(...uniq_row2) / 2).toFixed(0);
              //console.log("++"+best_row);
            } else {
              best_row = (Math.max(...uniq_row2) / 2).toFixed(0);
              //console.log("--"+best_row);
            }
          } else {
            result[i] = result[i].split("0000");
            //console.log(result[i])
            best_places_row.push(result[i][0]);

            var lang = [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
              "O",
              "P",
              "Q",
              "R",
              "S",
              "T",
              "U",
              "V",
              "W",
              "X",
              "Y",
              "Z"
            ];

            for (var x = 0; x < lang.length; x++) {
              if (result[i][0] == lang[x]) {
                //console.log(result[i][0]+"--"+lang[x]);
                //console.log(lang[x]);
                //x = parseInt(x);
                var r = result[i][0];

                fn_seat[i] = {
                  row: result[i][0],
                  seat: parseInt(result[i][1])
                };
                //console.log(fn_seat[1]);

                fn_row.push(r);

                //console.log(result[i][0]+"-"+result[i][1]);
              }
              //else {console.log(x +" = "+ result[i][0]);}
            }

            //console.log(fn_row);

            uniq_row2 = Array.from(new Set(fn_row));
            uniq_row2.sort(function(a, b) {
              return a - b;
            });
            //console.log(uniq_row2);
            best_row = uniq_row2[(uniq_row2.length / 2).toFixed(0)];
            //console.log("//" + best_row);
          }
          //console.log(uniq_row2);
          //best_row = best_row[parseFloat(best_row.toFixed(0))];
          //console.log(best_row);

          /*uniq_seat2 = Array.from(new Set(fn_seat));
      uniq_seat2.sort(function(a, b) {
      return a - b;
      });
      best_seat = uniq_seat2.length / 2 - 1;
      best_seat = uniq_seat2[parseFloat(best_seat.toFixed(0))];

              console.log(
          "uniq seats- " + uniq_seat.length + " best_seat " + best_seat
        );*/

          //best_places.seat = result[i][1];
        }
        //console.log (fn_seat[0]);
        } catch (err) {
    console.log(err);
  }
        return fn_seat;
      }


      //console.log(fn_seat.length);

      //console.log("--"+typeof(best_row));

      /*
var best_row = 1;
var best_row_arr = [best_row];
for (var x=1; x<4; x++){
  if ((best_row-x) > 0 )
    {
  best_row_arr.push((best_row-x));
    }
  best_row_arr.push((best_row+x));
  //console.log(x);
   }
  console.log(best_row_arr);
*/

      /*var bb_seat = [];

          for (var x =0; x <fn_seat.length; x++) {
        if (fn_seat[x].row == best_row ) {
          bb_seat.push(fn_seat[x].seat);

          for (var y = best_seat+xp; y > best_seat+xp; y++)

            {console.log("-"+y);}




          //console.log(fn_seat[x].seat+",");
        }
        //else {console.log(x+"-------------"+fn_seat[x].seat+"-"+fn_seat[x].row);}
      }

*/
      //console.log(fn_seat[0].row);

      //console.log("-------"+arr_seat);
      get_places(full_schem);

      console.log("best_row=" + typeof best_row);

      var re2 = new RegExp("^[a-zA-Z].*$");
      re2 = re2.test(best_row);
      if (re2 == false) {
        best_row = parseInt(best_row);
        var best_row_arr = [best_row];

        for (var x = 1; x < 4; x++) {
          if (best_row - x > 0) {
            //best_row=best_row-x;
            best_row_arr.push(best_row - x);
          }
          //best_row=best_row+x;
          best_row_arr.push(best_row + x);
          //console.log(x);
        }
        console.log(best_row_arr);

        var ar1 = [];
        for (var i = 0; i < fn_seat.length; i++) {
          //var bb = best_row_arr[i];
          //console.log(i);

          if (fn_seat[i].row == best_row_arr[x]) {
            ar1.push(fn_seat[i].seat);

            //console.log(ar1);
            //console.log(fn_seat[i].row + "-" + fn_seat[i].seat);
          }
        }

        get_places(result_ar);

        for (var x = 0; x < best_row_arr.length; x++) {
          var ar = [];
          for (var i = 0; i < fn_seat.length; i++) {
            //var bb = best_row_arr[i];
            //console.log(i);

            if (fn_seat[i].row == best_row_arr[x]) {
              ar.push(fn_seat[i].seat);

              //console.log(x);
              //console.log(fn_seat[i].row + "-" + fn_seat[i].seat);
            }
          }

          var closer = getClosestNum(Math.max(...ar) / 2, ar);

          console.log(
            "row " + best_row_arr[x] + " closer = " + closer + " x = " + ar
          );
          //console.log(ar.indexOf(closer));
          if (count % 2 == true) {
            var xl = (count - 1) / 2;
            var xp = xl;
          } else {
            //var current;
            var xl = parseInt(((count - 1) / 2).toFixed(0));
            var xp = parseInt(count - xl - 1);
          }
          var tikets = [];

          var start = parseInt(ar.indexOf(closer) - xp);
          var finish = parseInt(ar.indexOf(closer)) + xl + 1;
          //console.log(typeof(xl));
          for ( y = start; y < finish;  y++ ) {
            //console.log(y);
            if (Math.abs(ar[y] - ar[y - 1]) == 1) {
              if (ar[y] > 9)
              {tikets.push(best_row_arr[x]+"000"+ar[y]);}
            if (ar[y] <10)
              {tikets.push(best_row_arr[x]+"0000"+ar[y]);}

              //console.log(ar[y-1]+"***"+ar[y]);
            } else {
              console.log(ar[y] - ar[y - 1]);
            }
          }
          if (tikets.length == count) {
            console.log("ok" + tikets);
            return;
          }
        }
      } else {
        console.log("re'lux");

       best_row_arr = ["B","C","D","A"];

        var ar1 = [];
        for (var i = 0; i < fn_seat.length; i++) {
          //var bb = best_row_arr[i];
          //console.log(i);

          if (fn_seat[i].row == best_row_arr[x]) {
            ar1.push(fn_seat[i].seat);

            //console.log(ar1);
            //console.log(fn_seat[i].row + "-" + fn_seat[i].seat);
          }
        }

        get_places(result_ar);

        for (var x = 0; x < best_row_arr.length; x++) {
          var ar = [];
          for (var i = 0; i < fn_seat.length; i++) {
            //var bb = best_row_arr[i];
            //console.log(i);

            if (fn_seat[i].row == best_row_arr[x]) {
              ar.push(fn_seat[i].seat);

              //console.log(x);
              //console.log(fn_seat[i].row + "-" + fn_seat[i].seat);
            }
          }

          var closer = getClosestNum(Math.max(...ar) / 2, ar);

          console.log(
            "row " + best_row_arr[x] + " closer = " + closer + " x = " + ar
          );
          //console.log(ar.indexOf(closer));
          if (count % 2 == true) {
            var xl = (count - 1) / 2;
            var xp = xl;
          } else {
            //var current;
            var xl = parseInt(((count - 1) / 2).toFixed(0));
            var xp = parseInt(count - xl - 1);
          }
          var tikets = [];

          var start = parseInt(ar.indexOf(closer) - xp);
          var finish = parseInt(ar.indexOf(closer)) + xl + 1;
          //console.log(typeof(xl));
          for ( y = start; y < finish;  y++ ) {
            //console.log(y);
            if (Math.abs(ar[y] - ar[y - 1]) == 1) {
              tikets.push(best_row_arr[x]+"0000"+ar[y]);
              //console.log(ar[y-1]+"***"+ar[y]);
            } else {
              console.log(ar[y] - ar[y - 1]);
            }
          }
          if (tikets.length == count) {
            console.log("ok" + tikets);
            return tikets;
          }
        }







      }
    });

};

bestSeats("imax-kiev", "417361", 4); //710 649

//console.log("BestSeats: "+bstst);

var geomShema = function(theatreid) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  var loginArgs = {
    headers: {
      "Content-Type": "application/json",
      "Image-Scale": "2"
    }
  };
  client.get(
    "http://test-cab.planetakino.ua/mapiv2/geometricsHallSheme?theaterId=" +
    theatreid,
    loginArgs,
    function(data, response) {
      if (response.statusCode == 200) {
        for (var i = 0; i < data.data.geometricsHallSheme.length; i++) {
          if (data.data.geometricsHallSheme[i].hallid == "216") {
            for (
              var x = 0;
              x < data.data.geometricsHallSheme[i].seats.length;
              x++
            ) {
              free_schem.push(data.data.geometricsHallSheme[i].seats[x].id);
            }
          }
        }

        //console.log("status code:", response.statusCode);
        //console.log("search result:", data);
        /*  for (var i = 0; i < data.data.geometricsHallSheme.length; i++) {
          console.log(data.data.geometricsHallSheme[i].hallName+data.data.geometricsHallSheme[i].hallid);
                  var uniq_seat = [];
        var uniq_row = [];
        var arr_row = [];
        var arr_seat = [];
        var best_row;
        var best_seat;

          //if (data.data.geometricsHallSheme[i].hallid == "210") {
            for (var x = 0; x < data.data.geometricsHallSheme[i].seats.length;x++) 
            {
              arr_row.push(data.data.geometricsHallSheme[i].seats[x].row);
            }
            //console.log( arr_row);
            uniq_row = Array.from(new Set(arr_row));
            uniq_row.sort(function(a, b) {
              return a - b;
            });
            best_row = uniq_row.length / 2;
            best_row = uniq_row[parseFloat(best_row.toFixed(0))];
           // console.log(best_row);
            console.log(
              "uniq rows- " + uniq_row.length + " best_row " + best_row
            );

            for (var x = 0; x < data.data.geometricsHallSheme[i].seats.length; x++) 
            {
              if (data.data.geometricsHallSheme[i].seats[x].row == best_row) 
              {
                arr_seat.push(data.data.geometricsHallSheme[i].seats[x].seat);
              }
            }
            //console.log( arr_row);
            uniq_seat = Array.from(new Set(arr_seat));
            uniq_seat.sort(function(a, b) {
              return a - b;
            });
            best_seat = uniq_seat.length / 2;
            best_seat = uniq_seat[parseFloat(best_seat.toFixed(0))];
            console.log(
              "uniq seats- " + uniq_seat.length + " best_seat " + best_seat
            );

            //console.log("seats - "+data.data.geometricsHallSheme[i].seats.length);}
          //}

          /*var arr = [                    "1000001",
                    "1000002",
                    "1000008",
                    "100001",
                    "1000015",
                    "1000016",
                    "100002",
                    "100003",
                    "100004",
                    "100005",
                    "100006",
                    "100007",
                    "100008",
                    "100009",
                    "100010",
                    "100011",
                    "100012",
                    "1100001",
                    "1100002",
                    "1100005",
                    "1100015",
                    "1100016",
                    "200001",
                    "200002",
                    "200011",
                    "200012",
                    "300001",
                    "300002",
                    "300011",
                    "300012",
                    "400001",
                    "400012",
                    "500001",
                    "500002",
                    "500012",
                    "600016",
                    "700001",
                    "700002",
                    "700016",
                    "800001",
                    "800002",
                    "800013",
                    "800014",
                    "800015",
                    "800016",
                    "900001",
                    "900002",
                    "900015",
                    "900016"];
var arr2 = [];
for (var i=0; i<arr.length; i++)
{var uniq_num = uniq[i]*1;
arr2.push(uniq_num);
}
            arr2.sort(function(a, b) {
              return a - b;
            });
var uniq = Array.from(new Set(arr2));
var uniq_num = uniq[0]*1
console.log(uniq);*/

        // }
        return free_schem;
      } else {
        console.log(response.statusCode);
        //throw "Login failed :(";
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

var getShema = function(showtimeId, hallId, callback) {
  var filepath = "./shemas/" + showtimeId + ".png";
  http.get(
    "http://cabinet.planetakino.ua/Hall/HallScheme?showtimeId=" +
    showtimeId +
    "&hallId=" +
    hallId +
    "&attrTechnology=Cinetech+2D",
    function(res) {
      var data = [];
      res
        .on("data", function(chunk) {
        data.push(chunk);
      })
        .on("end", function() {
        //at this point data is an array of Buffers
        //so Buffer.concat() can make us a new Buffer
        //of all of them together
        var buffer = Buffer.concat(data);
        buffer = buffer.toString();
        buffer =
          "<html><head><link type='text/css' rel='stylesheet' media='all' href='./StaticContent/css/shema.css'></head><body>" +
          buffer +
          "</body></html>";
        //console.log(buffer);

        var options = {
          siteType: "html",
          shotSize: { width: 600, height: 600 },
          defaultWhiteBackground: true,
          renderDelay: 4000
        };

        webshot(buffer, filepath, options, function(err) {
          // screenshot now saved to hello_world.png
        });
        /*fs.writeFile(filepath, buffer, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
}); */
      });
    }
  );

  //showtimeId=405940&theaterId=imax-kiev&hallId=212&attrTechnology=Cinetech+2D
};

//http://cabinet.planetakino.ua/mapiv2/showtimes?theaterId=pk-lvov2&endDate=2017-09-16&startDate=2017-09-15

var getFreeseats2 = function(showtimeid, callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  //console.log("showtimeid - " + showtimeid);
  client.get(
    "http://test-cab.planetakino.ua/mapiv2/halls?showTimeid=403712",
    function(data, response) {
      if (response.statusCode == 200) {
        //console.log("status code:", response.statusCode);
        //  console.log();
        console.log(
          "free seats",
          data.data.hallsSheme[0].ticketsLeftForPurchasing
        );
        if (data.data.hallsSheme[0].emptySeats != null) {
          console.log("ok1");
        }
        if (data.data.hallsSheme[0].busySeats != null) {
        }
        //getShema(showtimeid, data.data.hallsSheme[0].hallId);
        //return data;
        console.log(data.data.hallsSheme[0].emptySeats);
      } else {
        console.log(response.statusCode);
        //throw "Login failed :(";
      }
      //callback(data);
    }
  );
};

var agergator = function(value1, value2) {
  console.log("val1 " + value1, "val2 " + value);
};

var getAll = async () => {
  var value1 = await geomShema("imax-kiev");
  var value2 = await getFreeseats2();
  console.log("val1 " + value1, "val2 " + value);
  return agergator(value1, value2);
};

var getFreeseats = function(showtimeid, callback) {
  var Client = require("node-rest-client").Client;
  client = new Client();
  console.log("showtimeid - " + showtimeid);
  client.get(
    "http://test-cab.planetakino.ua/mapiv2/halls?showTimeid=" + showtimeid,
    function(data, response) {
      if (response.statusCode == 200) {
        //console.log("status code:", response.statusCode);
        //  console.log();
        console.log(
          "free seats",
          data.data.hallsSheme[0].ticketsLeftForPurchasing
        );
        getShema(showtimeid, data.data.hallsSheme[0].hallId);
        //callback(data);
      } else {
        console.log(response.statusCode);
        //throw "Login failed :(";
      }
      //callback(data);
    }
  );
};
//getFreeseats('403543');
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
//geomShema('imax-kiev');
//getFreeseats2();
//showtimes('imax-kiev', '2017-09-15', '2017-09-16');

module.exports.getFreeseats = getFreeseats;
module.exports.showtimes = showtimes;
module.exports.theater = theater;
module.exports.token = token;
module.exports.films = films;
