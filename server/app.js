const express = require('express');
const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));

app.get('/', (req, res) => {
    res.sendFile('/client/index.html');
});

const io = require('socket.io')(server, {
    path: '/',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}

io.on('connection', socket => {
    console.log('a user connected');
});

app.listen(PORT, () => {
    console.log('Server running...');
});
