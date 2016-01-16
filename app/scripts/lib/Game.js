function Game(){
    this.soundFX   = new SoundFX();
    this.board   = Snap(IDCANVAS);
    this.sepLine = this.board.line(0,0,0,600);
    this.sepLine.addClass('separate-line');
}

Game.prototype.init = function(){
    this.setupEnvironment();


    this.initEvents();

    this.setupLevel();
    this.initObjectMovement();

    document.getElementById('time').innerHTML = this.duration;

    this.start();
}

Game.prototype.replay = function(){
    for( var i = 0; i < this.objects.length; i++ ){
        this.objects[i].remove();
    }

    this.init();
}

Game.prototype.setupEnvironment = function(){
    this.duration  = DURATION.game;
    this.state     = STATE.IDLE;
    this.score     = 0;
    this.objects   = [];
    this.level     = 1;
    this.prevState = 'idle';
    this.diamond   = 0;

    setTextForDOM('scoreboard', this.score );
    setTextForDOM('special-item', this.diamond );
}

Game.prototype.initEvents = function(){
    var self = this;
    /* Separate Line */
    this.board.drag(function(dx,dy,x,y, event ){
        /* Ignore right click */
        if( event.button == 2 ) {
            return;
        }
        /* Move Event */
		  console.log( self.state );
		self.sepLine.dx = dx;
		self.sepLine.dy = dy;
		console.log("dx and dy", self.sepLine.dx + " " + self.sepLine.dy);


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
    },function(x,y, event ){
        /* Ignore right click */
        if( event.button == 2 ) {
            return;
        }

        if( self.state == STATE.waiting || self.state == STATE.TIMEUP ) return;
        self.sepLine.originX = x;
        self.sepLine.originY = y;
    },function(x,y){
        /* Ignore right click */
        if( event.button == 2 ) {
            return;
        }

        if ( Math.abs(self.dx) < 3 || Math.abs(self.dy) < 3 ) {
            console.log("small line");
            if( self.state == STATE.SELECTING ){
                fadeOutLine();
            }
            return ;
        }
		self.computeScore();
        if( self.state == STATE.SELECTING ){
            fadeOutLine();
        }
		self.sepLine.dx = 0;
		self.sepLine.dy = 0;
    });

    $(IDCANVAS).bind("contextmenu",function(e){
       self.useSpecialItem();
       return false;
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


}

Game.prototype.initObjectMovement = function(){
    var self = this;
    this.movement_timer = setInterval(function(){
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
    clearInterval(this.movement_timer);

    this.setState('timeup');
    // this.board.undrag();

    var finalScore = this.score + DIAMOND_MULTIPIER * this.diamond;
    setTextForDOM('final-score', finalScore );

    showDOM('control-pane');
}

Game.prototype.setupLevel = function(){
    var self  = this;
    var level = this.level;
    if( this.level > MAX_LEVEL  ){
        level = MAX_LEVEL;
    }

    var setting = LEVEL_SETTING[level];
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
	console.log( k);
    if( Object.keys(STATE).indexOf(k) == -1 ){
        throw new Error( "This state doesn't exist : " + k );
    }
    this.board.removeClass(this.prevState);

    this.state = STATE[state.toUpperCase()];
    this.board.addClass(state);
    this.prevState = state;
}

Game.prototype.computeScore = function(){
	console.log("scoringgg")
    var score = this.objects.length / 2;
	var x1 = this.sepLine.originX;
	var y1 = this.sepLine.originY;
	var x2 = x1 + this.sepLine.dx;
	var y2 = y1 + this.sepLine.dy;

	var baskets = {
		left: [],
		right: []
	}

	for (var i = 0; i < this.objects.length; ++i) {
		var object = this.objects[i];
		var objectX = object.attr('x');
		var objectY = object.attr('y');

		var key = 'right';
		var check = checkLeftOrRight(x1, y1, x2, y2, objectX, objectY);
		if (check > 0) {
			key = 'left';
		}

		if (!baskets[key][object.type]) {
		   	baskets[key][object.type] = 0;
		}
		baskets[key].push(object);
		baskets[key][object.type]++;
	}

	//Counting left and right
	var leftDogObjects 	= !baskets['left']['dog'] ? 0 : baskets['left']['dog'];
	var rightDogObjects = !baskets['right']['dog'] ? 0 : baskets['right']['dog'];
	var leftCatObjects 	= !baskets['left']['cat'] ? 0 : baskets['left']['cat'];
	var rightCatObjects = !baskets['right']['cat'] ? 0 : baskets['right']['cat'];

	//Wrong separation results in some penalties
	var penalty = Math.abs(rightCatObjects - leftCatObjects)
		+ Math.abs(rightDogObjects - leftDogObjects);

    if( penalty == 0 ) {
        this.awesome();
    }else {
        this.soundFX.play('oh-no');
    }

	score -= penalty;
	if (score < 0) score = 0;


    this.score += score;

    var nextLevelScore = BASE_SCORE * Math.pow(this.level, 2);

    if( this.score > nextLevelScore ) {
        this.nextLevel();
    } else {
        console.log("Next Level Score: ", nextLevelScore );
    }

    document.getElementById('scoreboard').innerHTML = this.score;
}

Game.prototype.nextLevel = function(){
    this.level = this.level + 1;
    this.setupLevel();
}

Game.prototype.awesome = function(){
    this.diamond = this.diamond + 1;
    this.soundFX.play('awesome');
    this._animateSpecial( '+', 1 );
}

Game.prototype._animateSpecial = function( sign, number ){
    var self = this;
    $('#special-animation').text( sign + number );
    $('#special-animation').show();
    $('#special-animation').fadeOut(function(){
        $('#special-item').text(  self.diamond );
    });
}

Game.prototype.useSpecialItem = function(){
    if( this.diamond >= SPECIAL_ITEMS_TRADE ) {
        this.diamond = this.diamond - SPECIAL_ITEMS_TRADE;
        this._animateSpecial( '-', SPECIAL_ITEMS_TRADE );
        /* Integrate with Geo.js */

        console.log('Use item!');
    }else {
        // Blink the item
        $("#special-item-wrapper").animate({opacity:0},200,"linear",function(){
            $(this).animate({opacity:1},200);
        });
        this.soundFX.play('error');
    }
}


