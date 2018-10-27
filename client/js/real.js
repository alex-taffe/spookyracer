const soc = io();
const socUrl = '/';
let socid;
let room_number;
let players = [];

let join_room = room_input => {
    console.log('joining room...');
    room_number = room_input.val();
    soc.emit(JOIN_ROOM, room_number, join_room_callback);
};

let create_room = room_input => {
    console.log('create room...');
    room_number = room_input.val();
    soc.emit(CREATE_ROOM, room_number, create_room_callback);
};

let accelerate = progress => {
    console.log('Accelerating...');
    soc.emit(ACCELERATE, room_number, socid, progress);
};

let create_room_callback = (success, string, socketid) => {
    if (success) {
        socid = socketid;
        players.push(socketid);
        $('#createroom').hide();
        $('#joinroom').hide();
        $('#roomnnumber').hide();
    }
};

let join_room_callback = (success, string, socketid, newplayers) => {
    if (success) {
        socid = socketid;
        players = newplayers;
        $('#createroom').hide();
        $('#joinroom').hide();
        $('#roomnnumber').hide();
    }
};

$(document).ready(function() {
      
    soc.on('connect', function() {
        console.log('Connected...');
    });

    soc.on('POSITION_UPDATE', playermap => {
        console.log(playermap);
    });

    soc.on('LAP', playermap => {
        console.log(playermap);
    });

    soc.on('PLAYER_JOINED', playerlist => {
        players = playerlist;
    });
});
