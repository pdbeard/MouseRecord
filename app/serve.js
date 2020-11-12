// Mouse position only records if mouse is not moving. 


const express = require("express");
const robot = require("robotjs");
const iohook = require("iohook");
const path = require('path');
const app = express();

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) { 
    res.redirect('public/index.html');
});

app.listen(8080);





//**** Routes ********/ 

let mousePositions = [];

app.get('/save', function(req, res) {
    console.log('Saving...');

    mousePositions=[];
    iohook.on("mouseclick", mouseLogger);
    iohook.start();
    res.redirect('save.html');
});

app.get('/recall', function(req, res) {
    console.log('Recalling...');

    mousePositions.forEach(position => {
        console.log(position);
        robot.moveMouseSmooth(position.x, position.y);
        robot.mouseClick();
        // robot.setMouseDelay(100);
    });

    res.redirect('recall.html');
});


app.get('/stop', function(req, res) {
    iohook.off("mouseclick", mouseLogger);
    mousePositions.pop();
    res.redirect('index.html');
});


// Deletes mouse positions that will trigger playback
app.get('/loopstop', function(req, res) {
    mousePositions.pop();
});



function mouseLogger(){
    console.log(robot.getMousePos());
    mousePositions.push(robot.getMousePos());
}
