const express = require( "express");
const ws = require( "ws");
const path = require('path');

const app = express();
const port = 9090;

const websocket = new ws.Server({
    noServer: true
})

websocket.on('connection', (socket)=> {
    console.info("client connected");

    socket.send("Test");

    socket.on('message', (message)=>{
        console.info(message.toString());
        socket.send("Connection successfully");
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

