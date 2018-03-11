#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var fs = require('fs');
var hbs = require('hbs');
hbs.Handlebars = require('handlebars');

var firebase = require("firebase");     

var config = {
  apiKey: "AIzaSyAwY_Lk5ZGWW2fBy83T-jpI9k1f5R7P72k",
  authDomain: "hacktj2018-ec5cf.firebaseapp.com",
  databaseURL: "https://hacktj2018-ec5cf.firebaseio.com/",
  storageBucket: "hacktj2018-ec5cf.appspot.com"
};
firebase.initializeApp(config);

process.env.PWD = process.cwd()

// -------------- express initialization -------------- //

// PORT SETUP
app.set('port', process.env.PORT || 5000 );
// SO THAT EXPRESS KNOWS IT IS SITTING BEHIND A PROXY
app.set('trust proxy', 1) // trust first proxy 

// -------------- variable initialization -------------- //
// handlebars compiled 
var index_hbs = compile_handlebars('index');
var signup_hbs = compile_handlebars('signup');
var login_hbs = compile_handlebars('login');
var form_hbs = compile_handlebars('form');
var dashboard_hbs = compile_handlebars('dashboard');
var searchCard_hbs = compile_handlebars('searchCard')
// -------------- express listener -------------- //

var listener = server.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});

// -------------- express getters -------------- //

app.get('/', function (req, res, next) {
    var user = firebase.auth().currentUser;
    if (user) {
      var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  if(snapshot.val().isSponsor) {
    render_dashboard(req, res, "display:none", "");
  }
  else {
      render_dashboard(req, res, "", "display:none");
  }
});
    } else {
      render_index(req, res);
    }
});

// -------------- intermediary login helper -------------- //
app.get('/login', function (req, res, next) {
    render_login(req, res);
});

app.get('/searchCard', function (req, res, next) {
     var user = firebase.auth().currentUser;

    if (user) {
      var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  if(snapshot.val().isSponsor) {
    render_search(req, res, "display:none", "");
  }
  else {
      render_search(req, res, "", "display:none");
  }
});
    } else {
      render_search(req, res, "display:none", "display:none");
    }
});

app.get('/signup', function (req, res, next) {
    render_signup(req, res);
});

app.get('/dashboard', function (req, res, next) {
        var user = firebase.auth().currentUser;

    if (user) {
      var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  if(snapshot.val().isSponsor) {
    render_dashboard(req, res, "display:none", "");
  }
  else {
      render_dashboard(req, res, "", "display:none");
  }
});
    } else {
      render_dashboard(req, res, "display:none", "display:none");
    }
});

app.get('/form', function (req, res, next) {
    var user = firebase.auth().currentUser;

    if (user) {
      var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  if(snapshot.val().isSponsor) {
    render_form(req, res, "display:none", "");
  }
  else {
      render_form(req, res, "", "display:none");
  }
});
    } else {
      render_form(req, res, "display:none", "display:none");
    }
});

// -------------- render helper -------------- //
function render_index(req, res, display_log) {
    var context = {};

    var htmlOutputString = index_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_signup(req, res) {
    var context = {  };

    var htmlOutputString = signup_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_login(req, res) {
    var context = {  };

    var htmlOutputString = login_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_dashboard(req, res, client, sponsor) {
    var context = {client_show: client,
                   sponsor_show: sponsor };


    var htmlOutputString = dashboard_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_form(req, res, client, sponsor) {
    var context = {client_show: client,
                   sponsor_show: sponsor };

    var htmlOutputString = form_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_search(req, res, client, sponsor) {
    var context = {client_show: client,
                   sponsor_show: sponsor };

    var htmlOutputString = searchCard_hbs.run(context);
    res.send(htmlOutputString);    
}


// -------------- handlebars functions -------------- //
function compile_handlebars(f_name) {
    template = {};
    template['run'] = hbs.Handlebars.compile(
            read_file_sync(f_name)
        );
    return template;
}

function read_file_sync(f_name) {
    return fs.readFileSync(__dirname +'\\'+f_name+'.hbs').toString();
}

io.on('connection',function(socket){
    socket.on("signup_user", function(data){
        
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
        var user = firebase.auth().currentUser;

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            firebase.database().ref('/users/'+user.uid).set({
                isSponsor: data.isSponsor,
                email: data.email,
                money: 0
            });
          } else {
            // No user is signed in.
          }
        });
        setTimeout(function(){
            socket.emit("done_login", {});
        }, 2000);
        socket.emit("done_signUp", {});
    });
    socket.on("login_user", function(data) {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
        setTimeout(function(){
            socket.emit("done_login", {});
        }, 2000);
        
    });
    socket.on("signout", function(data) {
      firebase.auth().signOut().then(function() {
        console.log("logout");
        socket.emit("done_signout", {});
      }).catch(function(error) {
        // An error happened.
      });

    });

    socket.on("submit_request", function(data) {
      var user = firebase.auth().currentUser;
      firebase.database().ref('/requests/'+data.name).set({
          name: data.name,
          category: data.category,
          frequency: data.frequency,
          cost: data.cost,
          description: data.description,
          service: data.service,
          outreach: data.outreach,
          education: data.education,
          gaming: data.gaming,
          technology: data.technology,
          submitter: user.uid
        });
      socket.emit("submitted", {});
    });

    socket.on("submit_sponsor", function(data) {
      var user = firebase.auth().currentUser;
      firebase.database().ref('/sponsors/'+user.uid).set({
          service: data.service,
          outreach: data.outreach,
          education: data.education,
          gaming: data.gaming,
          technology: data.technology,
          phone: data.phone,
          maxBudget: data.maxBudget,
          description: data.description,
          once: data.once,
          weekly: data.weekly,
          biweekly: data.biweekly,
          monthly: data.weekly,
          yearly: data.yearly,
          submitter: user.uid
        });
      socket.emit("submitted", {});
    });

    socket.on("getEvents", function(data) {
        var rootRef = firebase.database().ref("requests/");
        rootRef.once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            socket.emit("newEventAdded", {file:'<div class="card border-primary mb-3" style="max-width: 40rem;" padding = "10px">\
        <div class="card-header">Event</div>\
        <div class="card-body">\
          <h4 class="card-title">'+child.val().name+'</h4>\
          <p id = "card-cost" class = "card-cost">'+child.val().goal+'</p>\
          <p id = "card-payment_method" class = "card-payment_method">'+child.val().dealType+'</p> \
          <p id = "card-text" class="card-text">'+child.val().description+'</p>\
          <button type="button" class="btn btn-success" onclick = "match()">Match</button>\
              <button type="button" class="btn btn-danger" onclick = "reject()">Reject</button>\
        </div>\
      </div>'});
          });
        });

      /*<div class="card border-primary mb-3" style="max-width: 40rem;" padding = "10px">
        <div class="card-header">Event</div>
        <div class="card-body">
          <h4 class="card-title">Hack TJ</h4>
          <p id = "card-cost" class = "card-cost"> $1000.00 </p>
          <p id = "card-payment_method" class = "card-payment_method">One time</p> 
          <p id = "card-text" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <button type="button" class="btn btn-success" onclick = "match()">Match</button>
              <button type="button" class="btn btn-danger" onclick = "reject()">Reject</button>
        </div>
      </div>*/
    });
})

app.use(express.static(process.env.PWD + '/'));