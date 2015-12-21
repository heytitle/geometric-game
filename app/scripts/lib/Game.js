function Game(){
    this.state    = STATE.IDLE;
    this.score    = 0;
    this.objects  = [];
    this.duration = DURATION.game;
    this.level    = 1;
    this.soundFX  = new SoundFX();

    this.prevState = 'idle';
    this.ended    = false;
}

Game.prototype.init = function(){
    this.board   = Snap(IDCANVAS);
    this.sepLine = this.board.line(0,0,0,600);
    this.sepLine.addClass('separate-line');
    document.getElementById('time').innerHTML = this.duration;

    this.initEvents();

    this.setupLevel();
    this.initObjectMovement();

    this.start();
}

Game.prototype.initEvents = function(){
    var self = this;
    /* Separate Line */
    this.board.drag(function(dx,dy,x,y){
        /* Move Event */
        if(  self.state == STATE.WAITING ) {
            console.log('Please wait a little bit.');
            return;
        }else {
            self.sepLine.addClass('show');
            self.setState('selecting');;
            fadeOutLine();
        }

        var endpoints = [0,600];
        for( var i = 0; i < endpoints.length; i++ ){
            var attrKey = 'x'+(i+1);
            endpoints[i] = (dx/dy)*(endpoints[i]-self.sepLine.originY)+self.sepLine.originX;
            self.sepLine.attr(attrKey, endpoints[i]);
        }
    },function(x,y){
        if( self.state == STATE.waiting || self.state == STATE.TIMEUP ) return;
        self.sepLine.originX = x;
        self.sepLine.originY = y;
    },function(x,y){
        self.setState('waiting');
        if( self.state == STATE.SELECTING ){
            fadeOutLine();
        }
    });

    function fadeOutLine(){
        self.sepLine.animate({ opacity:0 }, DURATION.selecting, function(){
            self.sepLine.removeClass('show');
            self.sepLine.attr('opacity',1);
            self.setState('waiting');

            setTimeout(function(){
                self.setState('idle');
            }, DURATION.waiting );
        });
    }

    /* Capture Key */
    window.addEventListener("keyup", function(e){
         if ( !(e.keyCode == "32" && self.state == STATE.SELECTING) || self.state == STATE.TIMEUP ) return;
         self.computeScore();
         self.setState('waiting');
         fadeOutLine();
    }, false);
}

Game.prototype.initObjectMovement = function(){
    var self = this;
    setInterval(function(){
        var speedRatio = 0.5;
        if( self.state == STATE.SELECTING ) {
            speedRatio = 0.02;
        }
        for( var i = 0; i< self.objects.length; i++ ){
            self.objects[i].move(
                self.board.node.offsetWidth,
                self.board.node.offsetHeight,
                speedRatio
            );
        }
    }, 50);
}

Game.prototype.start = function(){
    var self = this;
    self.timer = setInterval(function(){
        var timeLeft = self.duration--;
        document.getElementById('time').innerHTML = timeLeft;
        if( timeLeft == 0 ) {
            self.stop();
        }
    }, 1000 );
}

Game.prototype.stop = function(){
    clearInterval(this.timer);
    this.setState('timeup');
    this.board.undrag();
}

Game.prototype.setupLevel = function(){
    var self    = this;
    var setting = LEVEL_SETTING[this.level];
    console.log(setting.objects);
    Object.keys(setting.objects).forEach( function(type){
        for( var i = 0; i < setting.objects[type]; i++ ){
            self.soundFX.play('addObject');
            var obj = new Character(
                self,
                type,
                randomInRange( 15,self.board.node.offsetWidth-15),
                randomInRange( 15,self.board.node.offsetHeight-15)
            );
            self.objects.push( obj );
        }
    });
};

Game.prototype.setState = function(state){
    var k = state.toUpperCase();
    if( Object.keys(STATE).indexOf(k) == -1 ){
        throw new Error( "This state doesn't exist : " + k );
    }
    this.board.removeClass(this.prevState);

    this.state = STATE[state.toUpperCase()];
    this.board.addClass(state);
    this.prevState = state;
}

Game.prototype.computeScore = function(){
    /* Compute Here */
    var score = 1000;
    /* End compute */

    this.score += score;
    document.getElementById('scoreboard').innerHTML = this.score;
}

Game.prototype.nextLevel = function(){
    this.level = this.level + 1;
    if( this.level > MAX_LEVEL  ){
        this.level = MAX_LEVEL;
    }
    this.setupLevel();
}

Game.prototype.loadSound = function(){
}
