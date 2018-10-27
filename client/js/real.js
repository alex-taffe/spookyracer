const soc = io();
const socUrl = '/';

let join_room = room_input => {
    console.log('joining room...');
    let room_number = room_input.val();
    soc.emit(JOIN_ROOM, room_number, join_room_callback);
};

let create_room = room_input => {
    console.log('create room...');
    let room_number = room_input.val();
    soc.emit(CREATE_ROOM, room_number, create_room_callback);
};

let create_room_callback = (success, string) => {
    if (success) {
        $('#createroom').hide();
        $('#joinroom').hide();
        $('#roomnnumber').hide();
    }
};

let join_room_callback = (success, string) => {
    if (success) {
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

    $('#createroom').on('click', () => create_room(room_input));

    $('#joinroom').on('click', () => join_room(room_input));
});
