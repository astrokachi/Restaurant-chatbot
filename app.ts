require("dotenv").config();
import { Socket } from "socket.io";
const session = require("express-session");

const express = require("express");
const app = express();
//create server
const http = require("http");
const server = http.createServer(app);
//initialize io
const io: Socket | any = require("socket.io")(server, {
	cors: { origin: "*" },
});
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const MemoryStore = session.MemoryStore;
const sessionMiddleware = session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	store: new MemoryStore(),
});
io.engine.use(sessionMiddleware);

app.get("/", (req: any, res: any) => {
	res.send("index.html");
});

server.listen(3000, () => {
	console.log("server is listening on port", 3000);
});

let orderHistory: string[] = [];
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
io.on("connect", (socket: any) => {
	console.log("Someone connected!", socket.id);

	const sessionData = socket.request.session;

	currentOrder = sessionData.current ? sessionData.current : currentOrder;
	orderHistory = sessionData.history ? sessionData.history : orderHistory;
	console.log(currentOrder, orderHistory);

	// console.log(sessionData);
	socket.emit("check existing data", currentOrder);

	socket.on("message", (message: number) => {
		if (message == 1) {
			socket.emit("place an order", foods);
		} else if (message == 99) {
			if (currentOrder.length > 0) {
				orderHistory.push(currentOrder);

				currentOrder = "";
				save(sessionData);
				socket.emit("order placed", "order placed");
			} else {
				socket.emit("no order", "No order to place");
			}
		} else if (message == 98) {
			if (orderHistory.length > 0) {
				socket.emit("return checkout history", {
					orderHistory: orderHistory,
					currentOrder: currentOrder,
				});
			} else {
				socket.emit("no history", {
					message: "You haven't completed any checkout yet",
					currentOrder: currentOrder,
				});
			}
		} else if (message == 97) {
			socket.emit("current order", currentOrder);
		} else if (message == 0) {
			currentOrder = "";
			save(sessionData);
			socket.emit("cancel order");
		} else {
			invalid(socket);
		}
	});

	socket.on("add order", (value: number) => {
		const current = foods.filter((food, i) => value === i + 1)[0];
		if (current) {
			if (currentOrder.length > 0) {
				currentOrder += `, ${current}`;
			} else {
				currentOrder += current;
			}
			socket.emit("order added");
			save(sessionData);
			socket.emit("restart", currentOrder);
		} else {
			invalid(socket);
		}
	});
});

function save(sessionData: any) {
	console.log(sessionData);
	sessionData.current = currentOrder;
	sessionData.history = orderHistory;
	sessionData.save();
}
function invalid(socket: Socket) {
	socket.emit("invalid input", "Please enter a valid input");
	socket.emit("restart", currentOrder);
}
