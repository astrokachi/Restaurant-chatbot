"use strict";
const express = require("express");
const app = express();
//create server
const http = require("http");
const server = http.createServer(app);
//initialize io
const io = require("socket.io")(server, { cors: { origin: "*" } });
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.send("index.html");
});
server.listen(3000, () => {
    console.log("server is listening on port", 3000);
});
io.on("connection", (socket) => {
    console.log("Someone connected!");
});
