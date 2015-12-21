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
    waitingDuration: 1000,
    gameDuration: 180, // 3 Mins
    score: 0,
    computeScore: function(){
        /* Compute Here */
        var score = 1000;
        /* End compute */

        this.score += score;
        document.getElementById('scoreboard').innerHTML = this.score;
    }
};

var paper   = Snap(IDCANVAS);
var sepLine = paper.line(0,0,0,600);
sepLine.addClass('separate-line');
document.getElementById('time').innerHTML = gameControl.gameDuration;

/* Separate line Handling */
paper.drag(function(dx,dy,x,y){
    /* Move Event */
    if( gameControl.state != STATE.IDLE  && gameControl.state != STATE.SELECTING ) {
        console.log('Please wait a little bit.');
        return;
    }else {
        sepLine.addClass('show');
        gameControl.state = STATE.SELECTING;
        sepLine.animate({ opacity:0 }, gameControl.selectingDuration, function(){
            sepLine.removeClass('show');
            sepLine.attr('opacity',1);
            gameControl.state = STATE.WAITING;

            setTimeout(function(){
                gameControl.state = STATE.IDLE;
            }, gameControl.waitingDuration );
        });
    }

    var endpoints = [0,600];
    for( var i = 0; i < endpoints.length; i++ ){
        var attrKey = 'x'+(i+1);
        endpoints[i] = (dx/dy)*(endpoints[i]-sepLine.originY)+sepLine.originX;
        sepLine.attr(attrKey, endpoints[i]);
    }
},function(x,y){
    sepLine.originX = x;
    sepLine.originY = y;
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
    if( gameControl.state == STATE.TIMEUP ) return;

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

/* Timer */
setInterval(function(){
    var timeLeft = gameControl.gameDuration--;
    document.getElementById('time').innerHTML = timeLeft;
    if( timeLeft == 0 ) {
        gameControl.state = state.TIMEUP;
    }
}, 1000 );

/* Capture Key */
window.addEventListener("keypress", function(e){
     if (e.charCode != "32" || gameControl.state != STATE.SELECTING ) return;
     gameControl.computeScore();
}, false);
