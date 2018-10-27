const soc = io();
const socUrl = '/';
let socid;
let room_number;

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

let accelerate = () => {
    console.log('Accelerating...');
    console.log(socid);
    soc.emit(ACCELERATE, room_number, socid);
};

let create_room_callback = (success, string, socketid) => {
    if (success) {
        socid = socketid;
        $('#createroom').hide();
        $('#joinroom').hide();
        $('#roomnnumber').hide();
    }
};

let join_room_callback = (success, string, socketid) => {
    if (success) {
        socid = socketid;
        $('#createroom').hide();
        $('#joinroom').hide();
        $('#roomnnumber').hide();
    }
};

$(document).ready(function() {
    let room_input = $('#roomnnumber');

    soc.on('connect', function() {
        console.log('Connected...');
    });

    soc.on('POSITION_UPDATE', socketid => {
        console.log(`${socketid} is accelerating`);
    });

    $('#createroom').on('click', () => create_room(room_input));
    $('#gas').on('click', () => accelerate());

    $('#joinroom').on('click', () => join_room(room_input));
});
