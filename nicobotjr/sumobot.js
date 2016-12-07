// =======================
// Sumobot Jr demo program
// =======================

'use strict';

var five = require('johnny-five');
var keypress = require('keypress');


var board = new five.Board();


board.on('ready', function () {

    console.log('Welcome to Sumobot Jr!');
    console.log('Control the bot with the arrow keys, and SPACE to stop.');

    var leftWheel = new five.Servo({ pin: 11, type: 'continuous' }).stop();
    var rightWheel = new five.Servo({ pin: 10, type: 'continuous' }).stop();

    var ctrl = control({leftWheel: leftWheel, rightWheel:rightWheel});

    var led = five.Led(13);

    keypress(process.stdin);

    process.stdin.resume();

    process.stdin.setEncoding('utf8');

    process.stdin.setRawMode(true);

    process.stdin.on('keypress', function (ch, key) {

        led.strobe(500);

        if (!key) { return; }

        if (key.name === 'q') {

            console.log('Quitting');
            process.exit();

        } else if(key.name === 'c'){
            ctrl.circle();
        } else if (key.name === 'up') {
            ctrl.up();
        } else if (key.name === 'down') {
            ctrl.down();
        } else if (key.name === 'left') {
            ctrl.left();
        } else if (key.name === 'right') {
            ctrl.right();
        } else if (key.name === 'space') {
            led.off();
            ctrl.stop();
        }
    });
});


function control(motors){

    function right(){
        console.log('Right');
        motors.leftWheel.cw();
        motors.rightWheel.cw(); 
    }

    function up(){
        console.log('Forward');
        motors.leftWheel.ccw();
        motors.rightWheel.cw();
    }

    function down(){
        console.log('Backward');
        motors.leftWheel.cw();
        motors.rightWheel.ccw();
    }

    function left(){
        console.log('Left');
        motors.leftWheel.ccw();
        motors.rightWheel.ccw();
    }

    function stop(){        
        console.log('Stopping');
        motors.leftWheel.stop();
        motors.rightWheel.stop();
    }

    function circle(){
        console.log('Cyrcle');
        up();
        setTimeout(function(){
            right();
            setTimeout(function() {
                up();
                setTimeout(function(){
                    stop();
                }, 500);

            }, 1000);                
        }, 500);
    }

    return{
        up: up,
        right: right,
        left: left,
        stop: stop,
        down : down,
        circle: circle
    }
}