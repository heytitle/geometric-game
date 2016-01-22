function Game(){
    this.soundFX   = new SoundFX();
    this.board   = Snap(IDCANVAS);
    this.ham = new HamSandwich();

    this.sepLine = this.board.line(0,0,0,600);
    this.sepLine.addClass('separate-line');
    this.sepLine.attr('opacity', DRAG_OPACITY );

    this.mouseOriginPointer = this.board.circle( -100, -100, 10 );
    this.mouseOriginPointer.addClass('mouse-origin-pointer');
    this.mouseOriginPointer.attr('opacity', DRAG_OPACITY );

    this.SCALED_HEIGHT = this.board.node.offsetHeight/SCALING;
    this.SCALED_WIDTH = this.board.node.offsetWidth/SCALING;

    this.originBoundary = new Box( this.SCALED_WIDTH, this.SCALED_HEIGHT );

    this.statusCounter;
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

    $('#scoreboard').text(this.score);
    $('#special-item').text(this.diamond);
}

Game.prototype.initEvents = function(){
    var self = this;
    /* Separate Line */
    // this.board.click(function(e){
    //     console.log('click');
    //     e.preventDefault();
    //     return false;
    // });
    this.board.drag(function(dx,dy,x,y, event ){
        /* Ignore right click */
        if( event.button == 2 ) {
            return;
        }
        /* Move Event */
		self.sepLine.dx = dx;
		self.sepLine.dy = dy;


        if(  self.state == STATE.WAITING ) {
            console.log('Please wait a little bit.');
            return;
        }else {
            self.sepLine.addClass('show');
            self.mouseOriginPointer.addClass('show');
            self.setState('selecting');
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
        if( event.button == 2 || self.state == STATE.USING_SPECIAL_ITEM ) {
            console.log("Not Drag");
            return;
        }

        self.mouseOriginPointer.attr('cx', x );
        self.mouseOriginPointer.attr('cy', y );

        if( self.state == STATE.waiting || self.state == STATE.TIMEUP ) return;
        self.sepLine.originX = x;
        self.sepLine.originY = y;
    },function(x,y ){
        /* Ignore right click */
        if(  self.state != STATE.SELECTING && self.state != STATE.WAITING  ) {
            console.log("Release from something eles");
            return;
        }


        if ( Math.abs(self.dx) < 3 || Math.abs(self.dy) < 3 ) {
            console.log("small line");
            if( self.state == STATE.SELECTING ){
		        self.computeScore();
                fadeOutLine();
            }
            return ;
        }
        if( self.state == STATE.SELECTING ){
            self.setState('waiting');
		    self.computeScore();
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
        self.mouseOriginPointer.animate({ opacity:0 }, DURATION.selecting, function(){
            this.attr('opacity', DRAG_OPACITY );
            this.removeClass('show');
        });
        self.sepLine.animate({ opacity:0 }, DURATION.selecting, function(){
            this.removeClass('show');
            this.attr('opacity', DRAG_OPACITY );
            self.setState('waiting');

            self.statusCounter = setTimeout(function(){
                self.setState('idle');
            }, DURATION.waiting );
        });
    }


}

Game.prototype.initObjectMovement = function(){
    var self = this;
    this.movement_timer = setInterval(function(){
        if( self.state == STATE.USING_SPECIAL_ITEM ) {
            return;
        }

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
    this.board.undrag();

    var finalScore = this.score + DIAMOND_MULTIPIER * this.diamond;
    $('#final-score').text(finalScore);

    $('#control-pane').show();
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

    clearTimeout( this.statusCounter );

    if( STATE[k] == this.state ) { return; }

    console.log("Set State: " + state );
    if( Object.keys(STATE).indexOf(k) == -1 ){
        throw new Error( "This state doesn't exist : " + k );
    }
    this.board.removeClass(this.prevState);

    this.state = STATE[state.toUpperCase()];
    this.board.addClass(state);
    this.prevState = state;
}

Game.prototype.computeScore = function(){
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
    if( this.diamond >= -1000 && this.state == STATE.IDLE ) {
        this.diamond = this.diamond - SPECIAL_ITEMS_TRADE;
        this._animateSpecial( '-', SPECIAL_ITEMS_TRADE );

        this.setState('using_special_item');

        /* Integrate with Geo.js */
        var baskets = { 'cat':[], 'dog':[] };
        var points  = [];
        for( var i = 0; i < this.objects.length; i++ ){
            var obj = this.objects[i];
            var p   = this.toOriginCoordinate( obj.point() );
            points.push(p);
            baskets[obj.type].push(p.duality());
        }

        var keys = Object.keys(baskets);
        var medLines = []
        for( var i = 0; i < keys.length; i++ ){
            var k = keys[i]
            var med = this.ham.findMedian( baskets[k] );
            medLines.push(med);
        }
        var point = this.ham.findIntersection(medLines[0], medLines[1]);
        var hint  = point.duality();
        hint = this.ham.adjustSeparateLine( hint, points );
        var points = this.originBoundary.intersectWithLine( hint );

        var avgX = 0;
        var avgY = 0;
        for( var i = 0; i < points.length; i++ ){
            var p = points[i];

            points[i] = this.toCanvasCoordinate(p);
            avgX = points[i].x/points.length;
            avgY = points[i].y/points.length;
        }

        var avgX = ( points[0].x + points[1].x )/2;
        var avgY = ( points[0].y + points[1].y )/2;

        var hintPoint = new Point( avgX, avgY );
        var hintCircle = this.board.circle( hintPoint.x, hintPoint.y, 10 );
        hintCircle.attr('opacity', DRAG_OPACITY );

        this.setOriginSepLine(hintPoint);

        var line;
        if( DEBUG ){
            line = this.board.line(
                points[0].x,
                points[0].y,
                points[1].x,
                points[1].y
            );
            line.attr({ stroke: '#000' } );
        }

        var self = this;
        self.sepLine.addClass('show');
        self.board.mousemove(function(e){
            self.updateSepLine( hintPoint.x - e.x, hintPoint.y - e.y );
        });

        var counter = setTimeout(function(){
            finishSpecialItem();
        }, DURATION.selecting * 2 );

        self.board.click(function(){
            clearTimeout(counter);
            finishSpecialItem();
        });

        function finishSpecialItem(){
            self.board.unmousemove();
            self.board.unclick();

            console.log("FINISH SPECIAL");

            self.computeScore();
            hintCircle.remove();
            if(line) {
                console.log(line);
                line.remove();
            }
            self.setState('IDLE');
            self.sepLine.removeClass('show');
        }


    }else {
        if( this.diamond < SPECIAL_ITEMS_TRADE ) {
            $("#special-item-wrapper").animate({opacity:0},200,"linear",function(){
                $(this).animate({opacity:1},200);
            });
            this.soundFX.play('error');
        }
    }
}

Game.prototype.setOriginSepLine = function(p){
    this.sepLine.originX = p.x;
    this.sepLine.originY = p.y;
}

Game.prototype.updateSepLine = function( dx, dy ){
    var endpoints = [0,600];
    for( var i = 0; i < endpoints.length; i++ ){
        var attrKey = 'x'+(i+1);
        endpoints[i] = (dx/dy)*(endpoints[i]-this.sepLine.originY)+this.sepLine.originX;
        this.sepLine.attr(attrKey, endpoints[i]);
    }
    this.sepLine.dx = dx;
    this.sepLine.dy = dy;
}

Game.prototype.toOriginCoordinate = function( p ) {
    return new Point(
        (p.x - this.board.node.offsetWidth/2)/SCALING,
        (this.board.node.offsetHeight/2 - p.y)/SCALING
    );
}

Game.prototype.toCanvasCoordinate = function( p ) {
    var x = SCALING*p.x + this.board.node.offsetWidth/2;
    var y = this.board.node.offsetHeight/2 - SCALING*p.y;
    return new Point(x,y);
}
