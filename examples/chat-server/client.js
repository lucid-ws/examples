/* global process */
"use strict";

const LucidServer = require("lucid-server");
const LucidClient = require("lucid-client");
const inquirer = require("inquirer");

const options = {
	url : "127.0.0.1",
	port : 25543
};

var client = new LucidClient(options, err => {
	if(err){
		console.log("Failed to connect :(");
		return;
	}
	
	getInput();
	
});

client.on("message", (type, data) => {
	switch(type){
		case "newMessage":
			console.log(`${data.author} > ${data.message}`);
			break;
		case "userJoined":
			console.log(`${data.username} has joined`);
			break;
		case "userLeft":
			console.log(`${data.username} has left`);
			break;
	}
});

function getInput(){
	inquirer.prompt([{type:"input", message:"> ", name:"input"}], prompt => {
		client.api
			.post("/messages")
			.send({message:prompt["input"]})
			.end((err, res) => {
				if(err){
					console.log("could not send");
				}
				getInput();
			});
	});
}