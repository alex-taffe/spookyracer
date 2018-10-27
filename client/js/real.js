const soc = io();
const socUrl = '/';

let join_room = () => {
    soc.emit(JOIN_ROOM);
};

let create_room = () => {
    soc.emit(CREATE_ROOM);
};

$(document).ready(function() {
    soc.on('connect', function() {
        console.log('Connected...');
    });

    create_room();
});
