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

process.env.PWD = process.cwd();

// -------------- express initialization -------------- //

// PORT SETUP
app.set('port', process.env.PORT || 5000 );
// SO THAT EXPRESS KNOWS IT IS SITTING BEHIND A PROXY
app.set('trust proxy', 1); // trust first proxy

// -------------- variable initialization -------------- //
// handlebars compiled 
var index_hbs = compile_handlebars('index');
var signup_hbs = compile_handlebars('signup');
var login_hbs = compile_handlebars('login');
var form_hbs = compile_handlebars('form');

// -------------- express listener -------------- //

var listener = server.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});

// -------------- express getters -------------- //

app.get('/', function (req, res, next) {
    render_index(req, res);
});

// -------------- intermediary login helper -------------- //
app.get('/login', function (req, res, next) {
    render_login(req, res);
});

app.get('/signup', function (req, res, next) {
    render_signup(req, res);
});

app.get('/user', function (req, res, next) {
    render_user(req, res);
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

function render_user(req, res) {
    var context = {  };

    var htmlOutputString = user_hbs.run(context);
    res.send(htmlOutputString);    
}

function render_form(req, res, client, sponsor) {
    var context = {client_show: client,
                   sponsor_show: sponsor };

    var htmlOutputString = form_hbs.run(context);
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
        socket.emit("done_signUp", {});
    });
    socket.on("login_user", function(data) {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
        socket.emit("done_login", {});
    });
    socket.on("signout", function(data) {
      firebase.auth().signOut().then(function() {
        console.log("logout");
        socket.emit("done_signout", {});
      }).catch(function(error) {
        // An error happened.
      });

    });
    socket.on("getUserInfo", function(data){
        var user = firebase.auth().currentUser;
        var myname = user.uid;
        var myemail = user.email;
        var myisSponsor = user.isSponsor;
        socket.emit("userInfoReceived", {name:myname, email:myemail, isSponsor:myisSponsor});
    })
});

app.use(express.static(process.env.PWD + '/'));