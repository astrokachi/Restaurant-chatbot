import { Socket } from "socket.io";

const express = require("express");
const app = express();
//create server
const http = require("http");
const server = http.createServer(app);
//initialize io
const io: Socket = require("socket.io")(server, { cors: { origin: "*" } });
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req: any, res: any) => {
	res.send("index.html");
});

server.listen(3000, () => {
	console.log("server is listening on port", 3000);
});

const orderHistory: string[] = [];
let currentOrder = "";
// do an api call to return random list of foods
const foods = [
	"Curry rice",
	"Beans and bread",
	"Mashed Potatoes",
	"Ofada rice and assorted stew",
	"Fetuccini",
	"Bolognese",
	"Spaghetti",
	"Yamarita and egg sauce",
	"Jollof rice",
	"Swallow",
];
// const swallow = ["Eba", "Pounded yam", "Semo"];
// const soups = ["Efo riro", "Ewedu", "Egusi", "Oha"];
io.on("connect", (socket) => {
	console.log("Someone connected!", socket.id);

	socket.on("message", (message: number) => {
		if (message == 1) {
			socket.emit("place an order", foods);
		} else if (message == 99) {
			if (currentOrder.length > 0) {
				orderHistory.push(currentOrder);
			} else {
				socket.emit("no order", "No order to place");
			}
		} else if (message == 98) {
			if (orderHistory.length > 0) {
				socket.emit("all placed orders", orderHistory);
			} else {
				socket.emit("no history", "You haven't made any order yet");
			}
		} else if (message == 97) {
			socket.emit("current order", currentOrder);
		} else if (message == 0) {
			currentOrder = "";
		} else {
			socket.emit("invalid input", "Please enter a valid input");
			console.log("end");
		}
	});


	socket.on("add order", (value: number) => {
		const current = foods.filter((food, i) => value === i + 1)[0];
		if (currentOrder.length > 0) {
			currentOrder += `, ${current}`;
		} else {
			currentOrder += current;
		}
		
		console.log(currentOrder);
	});
});
