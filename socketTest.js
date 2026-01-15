import {io} from 'socket.io-client';

console.log("socketTest is running");

const SOCKET_URL = "http://localhost:5000"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTY2YzNjZDI4Zjk3MzRlNjI2OGI4NGYiLCJpYXQiOjE3NjgzNDI1MTAsImV4cCI6MTc2ODk0NzMxMH0.GbAyGWt_jFOq20STGmXSx07PNj9w3Dm9bTRZQyF5-cA"
const CHAT_ID = "6966cd2b778dae5a9533db5a";
const socket = io(SOCKET_URL);
socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});

socket.on("connect",()=>{
    console.log(`socket connected by socket:${socket.id} `);
    socket.emit("setup",TOKEN);
});


socket.on("connected",(chatId)=>{
    console.log("socket authenticated by the server");
    socket.emit("join chat",CHAT_ID);
});


socket.on("new message",(message)=>{
    console.log("message received",message.content);
});

socket.on("typing",(data)=>{
  console.log("User is typing",data);
});

socket.on("stop typing",(data)=>{
  console.log("User has stopped typing",data);
});






setTimeout(() => {
  socket.emit("typing",CHAT_ID);
}, 5000);



setTimeout(() => {
  socket.emit("stop typing",CHAT_ID);
}, 10000);

