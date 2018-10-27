const express = require('express');
const app = express();
const server = require('http').Server(app);
const event = require('./constants');

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    serveClient: false
});
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));

// route main requests to html
app.get('/', (req, res) => {
    res.sendFile('/client/index.html');
});

// error handling
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}

let gamerooms = {};

// set up socket connection
io.on('connection', socket => {
    console.log('a user connected');

    socket.on(event.JOIN_ROOM, (room_number, callback) => {
        console.log(`Joining room number ${room_number}`);
        if (room_number in gamerooms) {
            if (gamerooms[room_number] < 6) {
                gamerooms[room_number]++;
                socket.join(room_number);
                callback(true, `Joined room ${room_number}`);
            } else {
                callback(false, `${room_number} is full!`);
            }
        } else {
            callback(false, `Room ${room_number} not found!`);
        }

    });

    socket.on(event.CREATE_ROOM, (room_number, callback) => {
        if (room_number in gamerooms) {
            callback(false, `${room_number} already exists!`);
        } else {
            gamerooms[room_number] = 1;
            console.log(`Created room number ${room_number}`);
            socket.join(room_number);
            callback(true, `Created room ${room_number}!`);
        }
    });
});

// listen on port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
