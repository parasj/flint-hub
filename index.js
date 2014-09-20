var express = require('express');
var app = express();

var DELTA = 1000; // kill flints after 10s heartbeat
var TIMEALIVE = 10000;

var flints = {};

var tick = function() {
	for (var i in flints) {
		flints[i].timeAlive += DELTA;
		if (flints[i].timeAlive > TIMEALIVE) {
			delete flints[i];
		}
	}
	setTimeout(tick, DELTA);
}
tick();

app.get('/connect/:id/:ip', function(req, res){
	var i = req.param('id');
	if (i in flints) {
		flints[i].timeAlive = 0;
	} else {
		flints[i] = {
			timeAlive: 0,
			ip: req.param('ip')
		}
	}
	res.send('hello world');
});

app.get('/nodes', function(req, res){
	res.send(JSON.stringify(flints));
});

app.listen(process.env.PORT || 5000);