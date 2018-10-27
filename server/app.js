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

// set up socket connection
io.on('connection', socket => {
    console.log('a user connected');

    socket.on(event.JOIN_ROOM, () => {
        console.log('Joining room...');
    });

    socket.on(event.CREATE_ROOM, () => {
        console.log('Joining room...');
    });
});

// listen on port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
