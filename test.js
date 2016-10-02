/*  
 * @name        test - examples for uTouch 
 * @author      Stoyan Elinov <info@elinimus.org>
 * @copyright   2016 Stoyan Elinov
 * @license     {@link https://opensource.org/licenses/MIT}
 * 
 */

var ti_myCanvas = new TouchInterpreter('myCanvas');



ti_myCanvas.addEventListener('tap', function (t){
    // t.x and t.y gives the coordinates of the tap
    console.log('TAP: x = ', t.x, 'y = ', t.y);
    
}, false);

ti_myCanvas.addEventListener('double-tap', function (t){
    // t.x and t.y gives the coordinates of the double tap
    console.log('DOUBLE-TAP: x = ', t.x, 'y = ', t.y);
}, false);

ti_myCanvas.addEventListener('swipe', function (t){
    // don't use 'swipe' and 'drag' at the same time on the same object
    // t.x and t.y gives the coordinates of the first touch
    // t.lastX and t.lastY - the coordinates of the last touch
    console.log('SWIPE: x = ', t.x, 'y = ', t.y, 'dx =', t.lastX, 'dy =', t.lastY);
}, false);

var x=0;
var y=0;
var ctx = document.getElementById('myCanvas').getContext("2d");

ti_myCanvas.addEventListener('drag', function (t){
    // t.x and t.y gives the coordinates of the first touch
    // t.lastX and t.lastY - the next coordinates in the dragging
    console.log('DRAG: x = ', t.lastX, 'y = ', t.lastY, 'press=', t.press);
    if (x != t.x && y != t.y){
        x = t.x;
        y = t.y;
        ctx.moveTo(t.x,t.y);
    }
        
    ctx.lineTo(t.lastX,t.lastY);
    ctx.stroke();
}, false);

ti_myCanvas.addEventListener('pinch', function (t){
    // t - gives the distance between the two fingers
    console.log('PINCH: dl = ', t);
}, false);

ti_myCanvas.addEventListener('press', function (t){
    // t.x and t.y gives the press position
    console.log('PRESS: x = ', t.x, 'y = ', t.y);
}, false);


//ti_myCanvas.removeEventListener('press');
