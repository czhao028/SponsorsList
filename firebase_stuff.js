var express = require('express'),
http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var firebase = require("firebase");  	

var config = {
  apiKey: "AIzaSyAwY_Lk5ZGWW2fBy83T-jpI9k1f5R7P72k",
  authDomain: "hacktj2018-ec5cf.firebaseapp.com",
  databaseURL: "https://hacktj2018-ec5cf.firebaseio.com/",
  storageBucket: "hacktj2018-ec5cf.appspot.com"
};
firebase.initializeApp(config);

server.listen(process.env.PORT || 5000);

io.on('connection',function(socket){
    console.log("a connection!");
    socket.on("signup_user", function(data){
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		  console.log(errorMessage);
		});
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    firebase.database().ref('/users/'+user.uid).set({
			    isCompany: data.isCompany,
			    name: data.name,
			    email:data.email,
			    money: 0
			});
		  }
		});
    });
    socket.on("login_user", function(data){
        firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    console.log("Logged in")
		  }
		});
    });
})

/*
firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  // An error happened.
});

*/


// GET, POST

app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});



