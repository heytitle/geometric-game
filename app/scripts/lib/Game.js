function Game(){
    this.state             = STATE.IDLE;
    this.score             = 0;
    this.objects           = [];
    this.duration          = DURATION.game;
    this.level             = 1;
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
        if( self.state != STATE.IDLE  && self.state != STATE.SELECTING ) {
            console.log('Please wait a little bit.');
            return;
        }else {
            self.sepLine.addClass('show');
            self.state = STATE.SELECTING;
            self.sepLine.animate({ opacity:0 }, DURATION.selecting, function(){
                self.sepLine.removeClass('show');
                self.sepLine.attr('opacity',1);
                self.state = STATE.WAITING;

                setTimeout(function(){
                    self.state = STATE.IDLE;
                }, DURATION.waiting );
            });
        }

        var endpoints = [0,600];
        for( var i = 0; i < endpoints.length; i++ ){
            var attrKey = 'x'+(i+1);
            endpoints[i] = (dx/dy)*(endpoints[i]-self.sepLine.originY)+self.sepLine.originX;
            self.sepLine.attr(attrKey, endpoints[i]);
        }
    },function(x,y){
        self.sepLine.originX = x;
        self.sepLine.originY = y;
    });

    /* Capture Key */
    window.addEventListener("keypress", function(e){
         if (e.charCode != "32" || self.state != STATE.SELECTING ) return;
         self.computeScore();
    }, false);
}

Game.prototype.initObjectMovement = function(){
    var self = this;
    setInterval(function(){
        if( self.state == STATE.TIMEUP ) return;

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
    clearInterval(self.timer);
    self.state = state.TIMEUP;
}

Game.prototype.setupLevel = function(){
    var self    = this;
    var setting = LEVEL_SETTING[this.level];
    Object.keys(setting).forEach( function(type){
        for( var i = 0; i < setting[type]; i++ ){
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

Game.prototype.computeScore = function(){
    /* Compute Here */
    var score = 1000;
    /* End compute */

    this.score += score;
    document.getElementById('scoreboard').innerHTML = this.score;
}