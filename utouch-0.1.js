/*  
 * @name        μTouch - a javascript touchscreen  library
 * @version     0.1
 * @author      Stoyan Elinov <info@elinimus.org>
 * @copyright   2016 Stoyan Elinov
 * @license     {@link https://opensource.org/licenses/MIT}
 * 
 */
 
 
function TouchInterpreter(aElementId){
    
    var ONE_FINGER = 1;
    var TWO_FINGERS = 2;
    var FIRST_FINGER = 0;
    var SECOND_FINGER = 1;
    
    var hElement = document.getElementById(aElementId);
    var hTouch = new Map();
    var fTap = new Set();
    var fDoubleTap = new Set();
    var fPress = new Set();
    var fSwipe = new Set();
    var fDrag = new Set();
    var fPinch = new Set();

    var taps=0;

    hElement.addEventListener('touchstart', function(e){
        for (var i=0; i < e.touches.length; i++){
            var id = e.touches[i].identifier;
            hTouch.set( id, {
                        x: e.touches[i].screenX,
                        y: e.touches[i].screenY,
                        lastX: e.touches[i].screenX,
                        lastY: e.touches[i].screenY,
                        press:undefined,
                        doubleTap: undefined,
                        t: Date.now()
                      });
            hTouch.get(id).press = setTimeout(function(){
                console.log('id = ', id);
                for (let item of fPress){
                    item(hTouch.get(id));
                }
                hTouch.get(id).press = undefined;
            }, 1100);
        }
    }, false);


    hElement.addEventListener('touchend', function(e){
        var endTime = Date.now();
        for(var i=0; i < e.changedTouches.length; i++){
            if (hTouch.size === ONE_FINGER){
                var dx = e.changedTouches[FIRST_FINGER].screenX - 
                         hTouch.get(FIRST_FINGER).x;
                         
                var dy = e.changedTouches[FIRST_FINGER].screenY - 
                         hTouch.get(FIRST_FINGER).y;
                         
                var dl = Math.round(Math.sqrt(dx*dx + dy*dy));
                var dt = endTime - hTouch.get(FIRST_FINGER).t;

                if(dl < 11 && dt < 100 && fTap.size > 0){
                    taps++;
                    clearTimeout(hTouch.get(FIRST_FINGER).press);
                    if (taps === 1 && fDoubleTap.size > 0 ){
                        setTimeout(function(){
                            if (taps === 1){
                                for (let item of fTap){
                                    item(hTouch.get(FIRST_FINGER));
                                }
                                taps = 0;
                            }else if (taps === 2){
                                for (let item of fDoubleTap){
                                    item(hTouch.get(FIRST_FINGER));
                                }
                                taps = 0;
                            }
                            taps = 0;
                        }, 250);
                    }else if (taps ===1 && fDoubleTap.size === 0){
                            clearTimeout(hTouch.get(FIRST_FINGER).press);
                            for (let item of fTap){
                                item(hTouch.get(FIRST_FINGER));
                            }
                            taps = 0;
                    }               
                }else if (dl > 11 && dt < 150 && fSwipe.size > 0){
                        clearTimeout(hTouch.get(FIRST_FINGER).press);
                        for (let item of fSwipe){
                            item(hTouch.get(FIRST_FINGER));
                        }
                }
            }else if (hTouch.size === TWO_FINGERS){
                hTouch.delete(1);
            }
        }
    }, false);

    hElement.addEventListener('touchmove', function(e){
        for(var i=0; i < e.changedTouches.length; i++){
            hTouch.get(i).lastX = e.changedTouches[i].screenX;
            hTouch.get(i).lastY = e.changedTouches[i].screenY;
        }       
        var dx, dy, dl;
        if (hTouch.size === ONE_FINGER){
            dx = hTouch.get(FIRST_FINGER).lastX - 
                 hTouch.get(FIRST_FINGER).x; 
                 
            dy = hTouch.get(FIRST_FINGER).lastY - 
                 hTouch.get(FIRST_FINGER).y;
            dl = Math.round(Math.sqrt(dx*dx+dy*dy));

            if (dl > 11){
                clearTimeout(hTouch.get(FIRST_FINGER).press);
                for (let item of fDrag){
                    item(hTouch.get(FIRST_FINGER));
                }
            }
        }else if (hTouch.size === TWO_FINGERS){
            dx = hTouch.get(FIRST_FINGER).lastX - 
                 hTouch.get(SECOND_FINGER).lastX;
                 
            dy = hTouch.get(FIRST_FINGER).lastY - 
                 hTouch.get(SECOND_FINGER).lastY;
                 
            dl = Math.round(Math.sqrt(dx*dx+dy*dy));
            clearTimeout(hTouch.get(FIRST_FINGER).press);
            clearTimeout(hTouch.get(SECOND_FINGER).press);
            for (let item of fPinch){
                item(dl);
            }

        }
    }, false);

    this.addEventListener = function (aEvent, aFunction, aState){
        if (aEvent == 'tap'){
            fTap.add(aFunction);             
        }else if (aEvent == 'double-tap'){
            fDoubleTap.add(aFunction);
        }else if (aEvent == 'press'){
            fPress.add(aFunction);
        }else if (aEvent == 'drag'){
            fDrag.add(aFunction);
        }else if (aEvent == 'swipe'){
            fSwipe.add(aFunction);
        }else if (aEvent == 'pinch'){
            fPinch.add(aFunction);
        }else if (aEvent == 'rotate'){
            //To Be or Not To Be
        }
    }

    this.removeEventListener = function (aEvent, aFunction, aState){
                
        if (aEvent == 'tap'){
            if (aFunction)
                fTap.delete(aFunction);
            else
                fTap.clear();
        }else if (aEvent == 'double-tap'){

        }else if (aEvent == 'press'){
            if (aFunction)
                fPress.delete(aFunction);
            else
                fPress.clear();
        }else if (aEvent == 'drag'){
            if (aFunction)
                fDrag.delete(aFunction);
            else
                fDrag.clear();

        }else if (aEvent == 'swipe'){
            if (aFunction)
                fSwipe.delete(aFunction);
            else
                fSwipe.clear();

        }else if (aEvent == 'pinch'){
            if (aFunction)
                fPinch.delete(aFunction);
            else
                fPinch.clear();
            
        }else if (aEvent == 'rotate'){
            //To Be or Not To Be
        }
    }
}
