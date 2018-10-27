const soc = io();
const socUrl = '/';

let join_room = () => {
    soc.emit(JOIN_ROOM);
    console.log('joining room...');
};

let create_room = () => {
    soc.emit(CREATE_ROOM);
    console.log('create room...');
};

$(document).ready(function() {
    soc.on('connect', function() {
        console.log('Connected...');
    });

    $("#createroom").on('click', create_room);

	$("#joinroom").on('click', join_room);
});
