function Game(){
    this.state     = STATE.IDLE;
    this.score     = 0;
    this.objects   = [];
    this.duration  = DURATION.game;
    this.level     = 1;
    this.soundFX   = new SoundFX();
    this.prevState = 'idle';
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
    },function(x,y){
        if( self.state == STATE.waiting || self.state == STATE.TIMEUP ) return;
        self.sepLine.originX = x;
        self.sepLine.originY = y;
    },function(x,y){
		  if ( Math.abs(self.dx) < 3 || Math.abs(self.dy) < 3 )  
         {
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
        this.soundFX.play('awesome');
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

Game.prototype.loadSound = function(){
}
