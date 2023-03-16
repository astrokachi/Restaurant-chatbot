"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const express = require("express");
const app = express();
//create server
const http = require("http");
const server = http.createServer(app);
//initialize io
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
});
store.on("error", function (error) {
    console.log(error);
});
const sessionMiddleware = session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
});
io.engine.use(sessionMiddleware);
function generateId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
app.get("/", (req, res) => {
    res.send("index.html");
});
server.listen(3000, () => {
    console.log("server is listening on port", 3000);
});
let orderHistory = {};
let currentOrder = {};
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
io.on("connect", (socket) => {
    // console.log("Someone connected!", socket.id);
    const sessionData = socket.request.session;
    let sessionId = generateId(13);
    currentOrder[sessionId] = sessionData.current ? sessionData.current : "";
    orderHistory[sessionId] = sessionData.history ? sessionData.history : [];
    console.log(sessionId);
    console.log(sessionData);
    socket.emit("check existing data", currentOrder[sessionId]);
    socket.on("message", (message) => {
        var _a;
        if (message == 1) {
            socket.emit("place an order", foods);
        }
        else if (message == 99) {
            if (currentOrder[sessionId].length > 0) {
                orderHistory[sessionId].push(currentOrder[sessionId]);
                currentOrder[sessionId] = "";
                save(sessionData, sessionId);
                socket.emit("order placed", "order placed");
            }
            else {
                socket.emit("no order", "No order to place");
            }
        }
        else if (message == 98) {
            if (((_a = orderHistory[sessionId]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                socket.emit("return checkout history", {
                    orderHistory: orderHistory[sessionId],
                    currentOrder: currentOrder[sessionId],
                });
            }
            else {
                socket.emit("no history", {
                    message: "You haven't completed any checkout yet",
                    currentOrder: currentOrder[sessionId],
                });
            }
        }
        else if (message == 97) {
            socket.emit("current order", currentOrder[sessionId]);
        }
        else if (message == 0) {
            currentOrder[sessionId] = "";
            save(sessionData, sessionId);
            socket.emit("cancel order");
        }
        else {
            invalid(socket, sessionId);
        }
    });
    socket.on("add order", (value) => {
        var _a;
        const current = foods.filter((food, i) => value === i + 1)[0];
        if (current) {
            if (((_a = currentOrder[sessionId]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                currentOrder[sessionId] += `, ${current}`;
            }
            else {
                currentOrder[sessionId] += current;
            }
            socket.emit("order added");
            save(sessionData, sessionId);
            socket.emit("restart", currentOrder[sessionId]);
        }
        else {
            invalid(socket, sessionId);
        }
    });
});
function save(sessionData, sessionId) {
    sessionData.current = currentOrder[sessionId];
    sessionData.history = orderHistory[sessionId];
    console.log("save", sessionData);
    sessionData.save();
}
function invalid(socket, sessionId) {
    socket.emit("invalid input", "Please enter a valid input");
    socket.emit("restart", currentOrder[sessionId]);
}
