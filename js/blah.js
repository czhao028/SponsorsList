<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	  <a class="navbar-brand" href="#">Dashboard</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation" style="">
	    <span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarColor02">
	    <ul class="navbar-nav ml-auto">
	      
	     <ul class="navbar-nav mr-auto">
			  
			  <li class="nav-item">
			    <a class="nav-link" href="#" onclick="signout()">Logout</a>
			  </li>
	    </ul>
	    
	  </div>
	</nav>
	<center id="list">
	<!--
		<div class="card border-primary mb-3" style="max-width: 40rem;" padding = "10px">
		  <div class="card-header">Event</div>
		  <div class="card-body">
		    <h4 class="card-title">Hack TJ</h4>
		    <p id = "card-cost" class = "card-cost"> $1000.00 </p>
		    <p id = "card-payment_method" class = "card-payment_method">One time</p> 
		    <p id = "card-text" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
		    <button type="button" class="btn btn-success" onclick = "match()">Match</button>
            <button type="button" class="btn btn-danger" onclick = "reject()">Reject</button>
		  </div>
		</div>
		<div class="card border-primary mb-3" style="max-width: 40rem;" padding = "10px">
		  <div class="card-header">School Club</div>
		  <div class="card-body">
		    <h4 class="card-title">TJ Ethics Bowl</h4>
		    <p id = "card-cost" class = "card-cost"> $100.00 </p>
		    <p id = "card-payment_method" class = "card-payment_method">monthly</p> 
		    <p id = "card-text" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
		    <button type="button" class="btn btn-success" onclick = "match()">Match</button>
            <button type="button" class="btn btn-danger" onclick = "reject()">Reject</button>
		  </div>
		</div>--> 
	</center>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
	function match(client_company, sponsor_company){
		socket.emit("match", {data: [client_company, sponsor_company]})
	}
	function reject(){
		//do something
	}
	function getCards() {
		socket.emit("getEvents", {});
	}
	var socket = io.connect('http://localhost:5000', { path:''});
         socket.on("newEventAdded", function(data) {
	    	document.getElementById("list").innerHTML += data.file;
	    	});
	getCards();
</script>