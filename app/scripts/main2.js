var IDCANVAS  = '#game-board';

var STATE = {
    IDLE: 0,
    SELECTING: 1,
    WAITING: 2,
    TIMEUP: 3
};

/* Set up Game */
var gameControl = {
    state: STATE.IDLE,
    selectingDuration: 1000,
    waitingDuration: 1000
};

var paper   = Snap(IDCANVAS);
var sepLine = paper.line(0,0,0,600);
sepLine.addClass('separate-line');

/* Separate line Handling */
paper.drag(function(dx,dy,x,y){
    /* Move Event */
    console.log(dx,dy);
    var endpoints = [0,600];
    for( var i = 0; i < endpoints.length; i++ ){
        var attrKey = 'x'+(i+1);
        endpoints[i] = (dx/dy)*(endpoints[i]-sepLine.originY)+sepLine.originX;
        sepLine.attr(attrKey, endpoints[i]);
    }
},function(x,y){
    if( gameControl.state != STATE.IDLE ) {
        console.log('Please wait a little bit.');
        return;
    }
    console.log('click');
    sepLine.addClass('show');
    gameControl.state = STATE.SELECTING;
    sepLine.originX = x;
    sepLine.originY = y;

    sepLine.animate({ opacity:0 }, gameControl.selectingDuration, function(){
        sepLine.removeClass('show');
        sepLine.attr('opacity',1);
        gameControl.state = STATE.WAITING;

        setTimeout(function(){
            gameControl.state = STATE.IDLE;
        }, gameControl.waitingDuration );
    });
});

/* Objects */

var objects = [];
var numObjects = 4;
for( var i=0; i < numObjects; i++ ){
    var c = 'dog';
    if( i < numObjects/2 ){
        c = 'cat';
    }
    obj = new Character(
        c,
        randomInRange( 15,paper.node.offsetWidth-15),
        randomInRange( 15,paper.node.offsetHeight-15)
    );
    objects.push( obj );
}

setInterval(function(){
    var speedRatio = 0.5;
    if( gameControl.state == STATE.SELECTING ) {
        speedRatio = 0.02;
    }
    for( var i = 0; i< objects.length; i++ ){
        objects[i].move(
            paper.node.offsetWidth,
            paper.node.offsetHeight,
            speedRatio
        );
    }
}, 50);
