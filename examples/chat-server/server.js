"use strict";

const LucidServer = require("lucid-server");
const LucidClient = require("lucid-client");

var server = new LucidServer();

const errors = {
	BadMessage : {message:"message should be between 0 and 1024 characters"}
}

// make a map between websocket clients and usernames
var usernames = {};

// give each client that connects their own username
server.on("clientConnected", client => {
	var name = `Guest ${Math.floor(Math.random() * 9999)}`;
	usernames[client] = name;
	console.log(`New client, given the name ${name}`);
	
	// broadcast the presence
	server.broadcast("userJoined", {username:name});
});

server.on("clientClose", client => {
	// broadcast the presence
	server.broadcast("userLeft", {username:usernames[client]});
});

// register a new HTTP API post endpoint for messages
server.api.post("/messages", (req, res) => {
	// message is a parameter of the json post
	var message = req.body.message;
	
	if(message && message.length > 0 && message.length < 1024){
		res.status(201);
		
		// broadcast the message to all clients
		server.broadcast("newMessage", {
			author : usernames[req.client],
			message
		});
		
	}else{
		res.status(400);
		res.json(errors.BadMessage);
	}
	res.end();
});