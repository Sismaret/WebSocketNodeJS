const express = require( "express");
const ws = require( "ws");
const path = require('path');

const app = express();
const port = 9090;

var clients = {};

const websocket = new ws.Server({
    noServer: true
})

var user;

websocket.on('connection', (socket)=> {
    console.info("client connected");

    socket.on('message', (message)=>{
        
        let typeMessage = JSON.parse(message.toString()).type;

        if(typeMessage == "login") {
            user = JSON.parse(message.toString()).user;
            clients[user] = socket;
            socket.send("Login successfully");
        } else if (typeMessage == "chat"){
            msgData = JSON.parse(message.toString()).msg;
            destUser = JSON.parse(message.toString()).dest;
            user = JSON.parse(message.toString()).user;
            var socketSend = clients[destUser];
            socketSend.send(msgData);
        }
        
    })

    socket.on('close', ()=>{
        console.info(`Client disconnected`);
    })
})


const server = app.listen(port, ()=>{
    console.info(`Sever started on ${port}`);
})


app.get("/", (request, response)=>{
    response.send("Hello World");
})

app.get("/chat", (request, response)=>{
    response.sendFile(path.join(__dirname+'/view/client.html'));
})

server.on("upgrade", (request, socket, head)=>{
    websocket.handleUpgrade(request, socket, head, (socket)=>{
        websocket.emit('connection', socket, request);
    })
})

