
objective = {
    "fn" : function(x) {
        return x**3 + x**2 - 2*x;
    },
    "derivative": function(x) {
        return 3*x**2 + 2*x - 2;
    }
}

plot = function(xs, ys) {
    for (let i = 1; i< xs.length; i++) {
        line(xs[i], ys[i], xs[i - 1], ys[i - 1]);
    }
}

drawArrow = function(x1, y1, x2, y2, offset=16) {
    //start new drawing state
    push();
    line(x1, y1, x2, y2);
    //gets the angle of the line
    var angle = atan2(y1 - y2, x1 - x2); 
    //translates to the destination vertex
    translate(x2, y2);
    //rotates the arrow point
    rotate(angle-HALF_PI); 
    fill(0, 0, 0);
    //draws the arrow point as a triangle
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2);
    pop();
}

initGraph = function() {
    strokeWeight(1);
    push();
    drawArrow(0, yOffset, width - 10, yOffset);
    drawArrow(xOffset, height, xOffset, 10);
    pop();

    push();
    stroke(4, 133, 209);
    strokeWeight(4);
    var xs = [], ys = [];
    for (let k = -300; k < 310; k+=10) {
        x = k / 100;
        y = objective.fn(x);
        xs.push(xOffset + xScale*x);
        ys.push(yOffset - yScale*y);
    }
    plot(xs, ys);
    pop();
    
    push();
    fill(255, 0, 0);
    ellipse(xOffset + xScale*xMin, yOffset - yScale*yMin, 10, 10);
    pop();

    push();
    textSize(14);
    rect(10, 10, 140, 30);
    text('Local optimum', 20, 30);
    fill(255, 0, 0);
    ellipse(130, 25, 10, 10);
    pop();
}


var xScale, xOffset, yScale, yOffset;
var startX = 2.0;
var lr = 0.02;
var currX = startX;
var currY = objective.fn(currX);
var nextX = currX, nextY = currY;

// Local optimum
let xMin = (Math.sqrt(7) - 1) / 3;
let yMin = objective.fn(xMin);



function setup() {
    var myCanvas = createCanvas(800, 400);
    myCanvas.parent("canvasContainer");
    noLoop();
    frameRate(2); 
    
    xScale = 150;
    xOffset = width / 2;
    yScale = 30;
    yOffset = height - 50;

    // create sliders
    lrSlider = createSlider(0, 500, lr * 1000);
    lrSlider.parent("lr-slider");
    xSlider = createSlider(-100, 300, startX * 100);
    xSlider.parent("start-slider");

    initGraph();
}

run = function() {
    loop();
}


function draw() {
    lr = lrSlider.value() / 1000;
    startX = xSlider.value() / 100;

    strokeWeight(2);
    currY = objective.fn(currX);
    delta = objective.derivative(currX);
    nextX += -lr*delta;
    nextY = objective.fn(nextX);
    line(xOffset + xScale*currX, yOffset - yScale*currY, 
         xOffset + xScale*nextX, yOffset - yScale*nextY);
    ellipse(xOffset + xScale*currX, yOffset - yScale*currY, 10, 10);
    ellipse(xOffset + xScale*nextX, yOffset - yScale*nextY, 10, 10);
    currX = nextX;
    currY = nextY;
    
    
    if ((Math.abs(currY - yMin) < 0.001) || (currX < -3) || (currX > 3)) {
        currX = startX;
        currY = objective.fn(currX);
        nextX = currX, 
        nextY = currY;
        clear();
        initGraph();
        strokeWeight(2);
        ellipse(xOffset + xScale*currX, yOffset - yScale*currY, 10, 10);
        noLoop();
    }
    
}