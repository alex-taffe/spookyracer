let pixelRatio = window.devicePixelRatio;
let devMode = false;

const updateTime = 15;

let canvas;
let ctx;
let timer;
let deviceNumber;
let totalDevices;

let courseWidth = 0;
let courseHeight = 0;

let touchOccuring = false;

const GameStates = Object.freeze({
    WaitingToJoin: 0,
    WaitingToStart: 1,
    Countdown: 2,
    InGame: 3,
    WonGame: 4,
    LostGame: 5
});

let gameState = GameStates.WaitingToJoin;

const colorPallete = ['#ff9a00', '#f93636', '#09ff00', '#c900ff', '#fbfaf4'];

const BoardProperties = {
    verticalOffset: 100,
    edgeDeviceOffset: 75,
    circleRadius: 100
};

let cars = [];

//makes the canvas scale right for retina devices
function scaleCanvas(canvas, context, width, height) {
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1;

    // determine the 'backing store ratio' of the canvas context
    const backingStoreRatio =
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

    // determine the actual ratio we want to draw at
    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
        // set the 'real' canvas size to the higher width/height
        canvas.width = width * ratio;
        canvas.height = height * ratio;

        // ...then scale it back down with CSS
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        // this is a normal 1:1 device; just scale it simply
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }

    // scale the drawing context so everything will work at the higher ratio
    context.scale(ratio, ratio);
}

//get the proper scale for all retina devices
function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Car {
    constructor(trackNumber) {
        this.trackNumber = trackNumber;
        this.color = colorPallete[trackNumber];
        this.progress = 0;
        this.laps = 1;
    }

    render(ctx, width, height, circleCenterX, circleCenterY) {
        let x = Math.abs(width * Math.cos(Math.PI + this.progress * 2 * Math.PI) + circleCenterX);
        let y = Math.abs(height * Math.cos(Math.PI + this.progress * 2 * Math.PI) + circleCenterY);
        ctx.fillStyle = colorPallete[this.trackNumber];
        ctx.strokeStyle = colorPallete[this.trackNumber];
        ctx.beginPath();
        ctx.rect(x, y, 7, 13);
        ctx.fill();
        ctx.stroke();
    }

    accelerate() {
        this.progress += 0.01;
        if (this.progress >= 1) {
            this.laps++;
            this.progress = 0;
        }
    }
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {

    let rect = canvasDom.getBoundingClientRect();

    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

$(document).ready(function() {

    let room_input = $('#roomnnumber');
    $('#gas').on('click', () => accelerate());
    $('#createroom').on('click', () => {
        gameState = GameStates.WaitingToStart;
        create_room(room_input);
    });
    $('#joinroom').on('click', () => {
        gameState = GameStates.WaitingToStart;
        join_room(room_input);
    });

    canvas = document.getElementById('game');

    ctx = canvas.getContext('2d');

    // let images = document.getElementById("gamePieces");
    // images.style.visibility = 'hidden';

    deviceNumber = 0;
    totalDevices = 5;

    //scale the canvas properly
    scaleCanvas(canvas, ctx, aspectRatio()[0], aspectRatio()[1]);

    cars.push(new Car(0));
    cars.push(new Car(1));
    cars.push(new Car(2));
    cars.push(new Car(3));
    cars.push(new Car(4));

    // Start the canvas updates
    timer = setInterval(drawGame, updateTime);

    // Set up touch events for mobile, etc
    canvas.addEventListener(
        'touchstart',
        function(e) {
            mousePos = getTouchPos(canvas, e);
            e.preventDefault();
            touchOccuring = true;
            console.log('start');
        },
        false
    );
    canvas.addEventListener(
        'touchend',
        function(e) {
            console.log('END');
            let mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
            touchOccuring = false;
        },
        false
    );
});

function aspectRatio() {
    let width = $('body').width();
    let height = $('body').height();
    let ratio = width / height;
    let destinationRatio = 96 / 100;

    if (ratio == destinationRatio) {
        return [width, height];
    } else if (ratio > destinationRatio) {
        width = width * destinationRatio;
        return [width, height];
    } else if (ratio < destinationRatio) {
        height = height * destinationRatio;
        return [width, height];
    }
}

function drawGame() {
    
    if (touchOccuring) {
        cars[deviceNumber].accelerate();
    }

    let normalizedWidth = canvas.width / devicePixelRatio;
    let normalizedHeight = canvas.height / devicePixelRatio;

    // Clear background
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(0, 0, normalizedWidth, normalizedHeight);
    ctx.fill();
    ctx.closePath();

    if (gameState == GameStates.WaitingToJoin) {
        ctx.save();
        ctx.translate(normalizedWidth / 2, 0);
        ctx.textAlign = 'center';
        ctx.font = '25px Arial';
        ctx.fillStyle = '#FFFFFF'; //score font color
        ctx.fillText('Join a game!', 0, 90); //player 1
        ctx.restore();
    } else if (gameState == GameStates.WaitingToStart) {
        for (var i = 0; i < players.length; i++) {
            ctx.save();
            ctx.translate(normalizedWidth / 2, 0);
            ctx.textAlign = 'center';
            ctx.font = '25px Arial';
            ctx.fillStyle = colorPallete[i]; //score font color
            ctx.fillText(`Player ${i + 1}`, 0, 90 + i * 30); //player 1
            ctx.restore();
        }
    } else if (gameState == GameStates.InGame) {
        if (deviceNumber == 0) {
            for (var i = 0; i < totalDevices; i++) {
                let topPosition = i * 19 + BoardProperties['verticalOffset'];
                let bottomPosition = (totalDevices - i - 1) * 19 - BoardProperties['verticalOffset'] + normalizedHeight;

                ctx.fillStyle = colorPallete[i];
                ctx.strokeStyle = colorPallete[i];
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.rect(
                    normalizedWidth - BoardProperties['edgeDeviceOffset'],
                    topPosition,
                    BoardProperties['edgeDeviceOffset'],
                    4
                );
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.rect(
                    normalizedWidth - BoardProperties['edgeDeviceOffset'],
                    bottomPosition,
                    BoardProperties['edgeDeviceOffset'],
                    4
                );
                ctx.fill();
                ctx.closePath();

                let heightDifference = Math.abs(topPosition - bottomPosition);

                let circleCenterY = (normalizedHeight + BoardProperties['verticalOffset']) / 2;
                let circleCenterX = normalizedWidth - BoardProperties['edgeDeviceOffset'];

                let radius = BoardProperties['circleRadius'];

                ctx.beginPath();
                ctx.arc(circleCenterX, circleCenterY - 10, heightDifference / 2, (3 * Math.PI) / 2, Math.PI / 2, true);
                ctx.stroke();
            }
        } else if (deviceNumber == totalDevices - 1) {
            for (var i = 0; i < totalDevices; i++) {
                let topPosition = i * 19 + BoardProperties['verticalOffset'];
                let bottomPosition = (totalDevices - i - 1) * 19 - BoardProperties['verticalOffset'] + normalizedHeight;

                ctx.fillStyle = colorPallete[i];
                ctx.strokeStyle = colorPallete[i];
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.rect(0, topPosition, BoardProperties['edgeDeviceOffset'], 4);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.rect(0, bottomPosition, BoardProperties['edgeDeviceOffset'], 4);
                ctx.fill();
                ctx.closePath();

                let heightDifference = Math.abs(topPosition - bottomPosition);

                let circleCenterY = (normalizedHeight + BoardProperties['verticalOffset']) / 2;
                let circleCenterX = BoardProperties['edgeDeviceOffset'];

                let radius = BoardProperties['circleRadius'];

                ctx.beginPath();
                ctx.arc(circleCenterX, circleCenterY - 10, heightDifference / 2, (3 * Math.PI) / 2, Math.PI / 2, false);
                ctx.stroke();
            }
        } else {
            for (var i = 0; i < totalDevices; i++) {
                ctx.fillStyle = colorPallete[i];
                ctx.beginPath();
                ctx.rect(0, i * 19 + BoardProperties['verticalOffset'], normalizedWidth, 4);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.rect(
                    0,
                    (totalDevices - i - 1) * 19 - BoardProperties['verticalOffset'] + normalizedHeight,
                    normalizedWidth,
                    4
                );
                ctx.fill();
                ctx.stroke();
            }
        }

        for (let i = 0; i < cars.length; i++) {
            let topPosition = i * 19 + BoardProperties['verticalOffset'];
            let bottomPosition = (totalDevices - i - 1) * 19 - BoardProperties['verticalOffset'] + normalizedHeight;

            let heightDifference = Math.abs(topPosition - bottomPosition);

            cars[i].render(
                ctx,
                normalizedWidth,
                heightDifference,
                normalizedWidth / 2,
                heightDifference / 2 - BoardProperties['verticalOffset']
            );
        }
    }

    ctx.save();
    ctx.translate(normalizedWidth / 2, 0);
    ctx.textAlign = 'center';
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF'; //score font color
    ctx.fillText('Spooky Racer', 0, 40); //player 1
    ctx.restore();
}
