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
let players = {};

// set up socket connection
io.on('connection', socket => {
    console.log('a user connected');

    /**
     * Join a premade room
     */
    socket.on(event.JOIN_ROOM, (room_number, callback) => {
        console.log(`Joining room number ${room_number}`);
        if (room_number in gamerooms) {
            if (gamerooms[room_number].players.length < 6) {
                // make players object with initial values
                players[socket.id] = {
                    progress: 0,
                    lap_num: 0
                };
                // push to player list
                gamerooms[room_number].players.push(players[socket.id]);
                socket.join(room_number);
                socket.broadcast.to(room_number).emit('PLAYER_JOINED', gamerooms[room_number].players);
                callback(true, `Joined room ${room_number}`, socket.id, gamerooms[room_number].players);
            } else {
                callback(false, `${room_number} is full!`);
            }
        } else {
            callback(false, `Room ${room_number} not found!`);
        }
    });

    /**
     * Create a room with a room number
     */
    socket.on(event.CREATE_ROOM, (room_number, callback) => {
        if (room_number in gamerooms) {
            callback(false, `${room_number} already exists!`);
        } else {
            // make players object with initial values
            players[socket.id] = {
                progress: 0,
                lap_num: 0
            };

            // add to gameroom map
            gamerooms[room_number] = {
                players: [players[socket.id]]
            };
            console.log(`Created room number ${room_number}`);
            socket.join(room_number);
            callback(true, `Created room ${room_number}!`, socket.id, gamerooms[room_number].players);
        }
    });

    /**
     * Accelerate the car in question
     */
    socket.on(event.ACCELERATE, (room_number, socketid, progress) => {
        players[socketid].progress = progress;
        let index = gamerooms[room_number].players.indexOf(players[socketid]);
        if (index > -1) {
            gamerooms[room_number].players.splice(index, 1);
        }
        gamerooms[room_number].players.push(players[socketid]);
        socket.broadcast.to(room_number).emit('POSITION_UPDATE', gamerooms[room_number].players);
    });

    /**
     * Report a finished lap to other players
     */
    socket.on(event.LAP, (room_number, socketid) => {
        players[socketid].lap++;
        let index = gamerooms[room_number].players.indexOf(players[socketid]);
        if (index > -1) {
            gamerooms[room_number].players.splice(index, 1);
        }
        socket.broadcast.to(room_number).emit('LAP', gamerooms[room_number].players);
    });

    /**
     * Report a win to other players
     */
    socket.on(event.WIN, (room_number, socketid) => {
        console.log(`${socketid} wins!`);
    });
});

// listen on port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
