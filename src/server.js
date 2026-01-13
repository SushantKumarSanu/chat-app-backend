import dotenv from 'dotenv';
dotenv.config();



import http from 'http';
import app from './app.js';
import connectDB from './configs/db.js';


connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000 ;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});