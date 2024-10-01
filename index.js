import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from "socket.io"; 
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost', // Ensure this matches the client's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        
        // Emit an event to the room after a user joins
        socket.to(room).emit("roomEvent", { message: 'A message from a room' });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('sendMessage', (data) => {
        console.log(data);
        socket.to(data.room).emit('recieveMessage', {from: data.from, message: data.message });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
