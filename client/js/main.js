let pixelRatio = window.devicePixelRatio;
let devMode = false;

const updateTime = 15;

let canvas;
let ctx;
let timer;
let deviceNumber;
let totalDevices;

const colorPallete = [
	"#ff9a00",
	"#f93636",
	"#09ff00",
	"#c900ff",
	"#fbfaf4"
];

const BoardProperties = {
	verticalOffset: 100,
	edgeDeviceOffset: 75
};

//makes the canvas scale right for retina devices
function scaleCanvas(canvas, context, width, height) {
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1;

    // determine the 'backing store ratio' of the canvas context
    const backingStoreRatio = (
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1
    );

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


/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }

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

class Car{
	constructor(color, trackNumber){
		this.color = color;
		this.trackNumber = trackNumber;
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


    canvas = document.getElementById("game");

    ctx = canvas.getContext("2d");

    // let images = document.getElementById("gamePieces");
    // images.style.visibility = 'hidden';

    deviceNumber = 0;
    totalDevices = 5;


    //scale the canvas properly
    scaleCanvas(canvas, ctx, aspectRatio()[0], aspectRatio()[1]);



    //start the canvas updates
    timer = setInterval(drawGame, updateTime);

    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function(e) {
        mousePos = getTouchPos(canvas, e);
        e.preventDefault();
    }, false);
    canvas.addEventListener("touchend", function(e) {
        //let mouseEvent = new MouseEvent("mouseup", {});
        //canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function(e) {
        let touch = e.touches[0];

    }, false);
});

function aspectRatio() {
    let width = $("body").width();
    let height = $("body").height();
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

	let normalizedWidth = canvas.width / devicePixelRatio;
	let normalizedHeight = canvas.height / devicePixelRatio;

    //clear background
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0,0, normalizedWidth, normalizedHeight);
    ctx.fill();
    ctx.closePath();
    if(deviceNumber == 0){
    	for(var i = 0; i < totalDevices; i++){

    		ctx.fillStyle = colorPallete[i];
    		ctx.beginPath();
    		ctx.rect(normalizedWidth - BoardProperties['edgeDeviceOffset'], i*19 + BoardProperties['verticalOffset'], BoardProperties['edgeDeviceOffset'], 4);
    		ctx.fill();
    		ctx.closePath();

    		ctx.beginPath();
    		ctx.rect(normalizedWidth - BoardProperties['edgeDeviceOffset'], (totalDevices - i - 1)*19 - BoardProperties['verticalOffset'] + normalizedHeight, BoardProperties['edgeDeviceOffset'], 4);
    		ctx.fill();
    		ctx.closePath();


    		ctx.beginPath();
			ctx.moveTo(normalizedWidth - BoardProperties['edgeDeviceOffset'],i*19 + BoardProperties['verticalOffset']);
			ctx.bezierCurveTo(20,100,200,100,200,20);
			ctx.stroke();
    	}
    } else if (deviceNumber == totalDevices - 1){

    } else{
    	for(var i = 0; i < totalDevices; i++){
    		ctx.fillStyle = colorPallete[i];
    		ctx.beginPath();
    		ctx.rect(0, i*19 + BoardProperties['verticalOffset'], normalizedWidth, 4);
    		ctx.fill();
    		ctx.closePath();

    		ctx.beginPath();
    		ctx.rect(0, (totalDevices - i - 1)*19 - BoardProperties['verticalOffset'] + normalizedHeight, normalizedWidth, 4);
    		ctx.fill();
    		ctx.closePath();
    	}
    }


    ctx.save();
	ctx.translate(normalizedWidth / 2, 0);
	ctx.textAlign = "center";
	ctx.font = "30px Arial";
	ctx.fillStyle = "#FFFFFF"; //score font color
	ctx.fillText("Spooky Racer", 0, 40); //player 1
	ctx.restore();

}
