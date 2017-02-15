function randomInRange(t,e){return Math.floor(Math.random()*(1+e-t))+t}function plusOrMinus(){return Math.random()>.5?1:-1}function checkLeftOrRight(t,e,i,n,o,s){return(i-t)*(s-e)-(n-e)*(o-t)}function Point(t,e){this.x=t,this.y=e}function Line(t,e,i){0==t?this.m=1/0:this.m=e/t,this.c=i.y-this.m*i.x,this.originPoint=i}function Box(t,e){this.width=t,this.height=e,this.boundaries=[new Line(1,0,new Point(0,this.height/2)),new Line(1,0,new Point(0,-this.height/2)),new Line(0,1,new Point(this.width/2,0)),new Line(0,1,new Point(-this.width/2,0))]}function HamSandwich(t,e){this.set1=t,this.set2=e}function Game(){this.soundFX=new SoundFX,this.board=Snap(IDCANVAS),this.ham=new HamSandwich,this.sepLine=this.board.line(0,0,0,600),this.sepLine.addClass("separate-line"),this.sepLine.attr("opacity",DRAG_OPACITY),this.mouseOriginPointer=this.board.circle(-100,-100,10),this.mouseOriginPointer.addClass("mouse-origin-pointer"),this.mouseOriginPointer.attr("opacity",DRAG_OPACITY),this.SCALED_HEIGHT=this.board.node.clientHeight/SCALING,this.SCALED_WIDTH=this.board.node.clientWidth/SCALING,this.originBoundary=new Box(this.SCALED_WIDTH,this.SCALED_HEIGHT),this.statusCounter}function Character(t,e,i,n){var o=30,s=t.board.image("images/characters/"+e+".png",i,n,o,o);s.type=e,s.direction=Math.random()*plusOrMinus(),s.moveTurn=randomInRange(0,100);var r=plusOrMinus(),a=plusOrMinus();return s.move=function(t,e,i){var n=parseInt(s.attr("x")),h=parseInt(s.attr("y"));100==++s.moveTurn&&(s.moveTurn=0,r=plusOrMinus(),a=plusOrMinus()),delX=r*i*MOVEMENT_CHARACTER[s.type].speedX,delY=a*i*MOVEMENT_CHARACTER[s.type].speedY,n+=delX,h+=delY,(n<o||n>t-o)&&(n-=2*delX,r=-r,s.moveTurn=0),(h<o||h>e-o)&&(h-=2*delY,a=-a,s.moveTurn=0),s.attr("x",n),s.attr("y",h)},s.point=function(){var t=parseInt(s.attr("width")),e=parseInt(s.attr("height")),i=parseFloat(s.attr("x")),n=parseFloat(s.attr("y"));return new Point(i+t/2,n+e/2)},s}function SoundFX(){Object.keys(SOUNDFX).forEach(function(t){var e=SOUNDFX[t];createjs.Sound.registerSound(e,t)}),this.play=function(t){createjs.Sound.play(t)}}function startGame(){$("#control-pane").hide(),$("#start-pane").hide(),$("#end-pane").css("display","table"),game.init()}function replay(){$("#control-pane").hide(),game.replay()}var IDCANVAS="#game-board",BASE_SCORE=5,SPECIAL_ITEMS_TRADE=1,DIAMOND_MULTIPIER=2,DRAG_OPACITY=.5,SCALING=30,STATE={IDLE:0,SELECTING:1,WAITING:2,TIMEUP:3,USING_SPECIAL_ITEM:4},DURATION={selecting:1e3,waiting:1e3,game:60},LEVEL_SETTING={1:{objects:{cat:2,dog:2}},2:{objects:{cat:2,dog:2}}},MAX_LEVEL=Object.keys(LEVEL_SETTING).splice(-1,1),MOVEMENT_CHARACTER={dog:{speedX:2,speedY:2},cat:{speedX:3,speedY:3}},SOUNDFX={addObject:"https://www.freesound.org/data/previews/21/21389_36084-lq.mp3",awesome:"https://www.freesound.org/data/previews/187/187925_3140412-lq.mp3","oh-no":"http://freesound.org/data/previews/131/131409_2337290-lq.mp3",error:"http://freesound.org/data/previews/188/188013_2906575-lq.mp3"},ACCEPTABLE_ERROR=.001;Point.prototype.duality=function(){var t=new Line(1,this.x,new Point(0,(-this.y)));return t},Point.prototype.distanceFromPoint=function(t){var e=this.x-t.x,i=this.y-t.y;return Math.sqrt(Math.pow(e,2)+Math.pow(i,2))},Point.prototype.distanceFromOrigin=function(){return this.distanceFromPoint(new Point(0,0))},Point.prototype.inBoundary=function(t,e,i,n){return this.x>=t-ACCEPTABLE_ERROR&&this.x<=i+ACCEPTABLE_ERROR&&this.y>=e-ACCEPTABLE_ERROR&&this.y<=n+ACCEPTABLE_ERROR},Point.prototype.isSamePoint=function(t){return this.x==t.x&&this.y==t.y},Point.prototype.distanceToLine=function(t){var e=Math.sqrt(Math.pow(t.m,2)+1),i=Math.abs(t.m*this.x-this.y+t.c);return i/e},Line.prototype.findPointOnLine=function(t){var e=new Point(t,(void 0));return e.y=this.m*e.x+this.c,e},Line.prototype.isPointOnLine=function(t){return this.m==1/0?t.x==this.originPoint.x:this.findPointOnLine(t.x).y.toFixed(4)==t.y.toFixed(4)},Line.prototype.isPointAbove=function(t){return this.m==1/0?t.x<=this.originPoint.x:t.y>=this.findPointOnLine(t.x).y},Line.prototype.intersectWithLine=function(t){if(this.m==t.m)return null;var e,i=this.c,n=this.m;this.m==1/0||t.m==1/0?this.m==1/0?(e=this.originPoint.x,i=t.c,n=t.m):(e=t.originPoint.x,i=this.c,n=this.m):e=(this.c-t.c)/(t.m-this.m);var o=n*e+i;return new Point(e,o)},Box.prototype.intersectWithLine=function(t){for(var e=[],i=0;i<this.boundaries.length;i++){var n=this.boundaries[i],o=t.intersectWithLine(n);o.inBoundary(-this.width/2,-this.height/2,this.width/2,this.height/2)&&e.push(o)}return e},MIN_NUMBER=-65e3,MAX_NUMBER=65e3,HamSandwich.prototype.findMedian=function(t){for(var e=[],i=0;i<t.length;i++){var n=t[i].findPointOnLine(MIN_NUMBER);e.push(n)}e.sort(this.sortPointBy("y"));var o=e[Math.floor(t.length/2)];for(events=[o],i=0;i<t.length-1;i++)for(d=i+1;d<t.length;d++){var s=t[i].intersectWithLine(t[d]);s&&events.push(s)}events.sort(this.sortPointBy("x"));for(var r,a=[],h=[],i=0;i<events.length;i++){for(var n=events[i],c=[],d=0;d<t.length;d++){var p=t[d],u=p.findPointOnLine(n.x);c.push(u)}c.sort(this.sortPointBy("y")),median=c[Math.floor(c.length/2)];for(var d=0;d<t.length;d++){var p=t[d];p.isPointOnLine(median)&&a.push(p)}a[a.length-1].isPointOnLine(n)&&(h.push(n),1==h.length&&(r=a[0]))}var l=a[0].findPointOnLine(MAX_NUMBER);return h.push(l),h},HamSandwich.prototype.findIntersection=function(t,e){for(index1=0,index2=0;index1<t.length-1&&index2<e.length-1;){if(startPoint1=t[index1],endPoint1=t[index1+1],startPoint2=e[index2],endPoint2=e[index2+1],line1=new Line(endPoint1.x-startPoint1.x,endPoint1.y-startPoint1.y,startPoint1),line2=new Line(endPoint2.x-startPoint2.x,endPoint2.y-startPoint2.y,startPoint2),intersection=line1.intersectWithLine(line2),null!=intersection&&(intersection.x-startPoint1.x)*(intersection.x-endPoint1.x)<=0&&(intersection.y-startPoint2.y)*(intersection.y-endPoint2.y)<=0)return intersection;t[index1+1].x>e[index2+1].x?index2++:index1++}},HamSandwich.prototype.adjustSeparateLine=function(t,e){for(var i=[[],[]],n=0;n<e.length;n++){var o=e[n];if(!t.isPointOnLine(o)){var s=0;t.isPointAbove(o)||(s=1),i[s].push(o)}}var r,a=1;if(i[0].length>i[1].length)r=i[0];else{if(!(i[0].length<i[1].length))return console.log("not shift"),t;a=-1,r=i[1]}r=r.sort(function(e,i){return e.distanceToLine(t)-i.distanceToLine(t)});var h=r[0].distanceToLine(t)/2,c=h/Math.cos(Math.atan(t.m));return t.c=t.c+a*c,t},HamSandwich.prototype.sortPointBy=function(t){return function(e,i){return e[t]-i[t]}},Game.prototype.init=function(){this.setupEnvironment(),this.initEvents(),this.setupLevel(),this.initObjectMovement(),document.getElementById("time").innerHTML=this.duration,this.start()},Game.prototype.replay=function(){for(var t=0;t<this.objects.length;t++)this.objects[t].remove();this.init()},Game.prototype.setupEnvironment=function(){this.duration=DURATION.game,this.state=STATE.IDLE,this.score=0,this.objects=[],this.level=1,this.prevState="idle",this.diamond=0,$("#scoreboard").text(this.score),$("#special-item").text(this.diamond)},Game.prototype.initEvents=function(){function t(){e.mouseOriginPointer.animate({opacity:0},DURATION.selecting,function(){this.attr("opacity",DRAG_OPACITY),this.removeClass("show")}),e.sepLine.animate({opacity:0},DURATION.selecting,function(){this.removeClass("show"),this.attr("opacity",DRAG_OPACITY),e.setState("waiting"),e.statusCounter=setTimeout(function(){e.setState("idle")},DURATION.waiting)})}var e=this;this.board.drag(function(i,n,o,s,r){if(2!=r.button){if(e.sepLine.dx=i,e.sepLine.dy=n,e.state==STATE.WAITING)return void console.log("Please wait a little bit.");e.sepLine.addClass("show"),e.mouseOriginPointer.addClass("show"),e.setState("selecting"),t();for(var a=[0,600],h=0;h<a.length;h++){var c="x"+(h+1);a[h]=i/n*(a[h]-e.sepLine.originY)+e.sepLine.originX,e.sepLine.attr(c,a[h])}}},function(t,i,n){return 2==n.button||e.state==STATE.USING_SPECIAL_ITEM?void console.log("Not Drag"):(e.mouseOriginPointer.attr("cx",t),e.mouseOriginPointer.attr("cy",i),void(e.state!=STATE.waiting&&e.state!=STATE.TIMEUP&&(e.sepLine.originX=t,e.sepLine.originY=i)))},function(i,n){return e.state!=STATE.SELECTING&&e.state!=STATE.WAITING?void console.log("Release from something eles"):Math.abs(e.dx)<3||Math.abs(e.dy)<3?(console.log("small line"),void(e.state==STATE.SELECTING&&(e.computeScore(),t()))):(e.state==STATE.SELECTING&&(e.setState("waiting"),e.computeScore(),t()),e.sepLine.dx=0,void(e.sepLine.dy=0))}),$(IDCANVAS).bind("contextmenu",function(t){return e.useSpecialItem(),!1})},Game.prototype.initObjectMovement=function(){var t=this;this.movement_timer=setInterval(function(){if(t.state!=STATE.USING_SPECIAL_ITEM){var e=.5;t.state==STATE.SELECTING&&(e=.02);for(var i=0;i<t.objects.length;i++)t.objects[i].move(t.board.node.clientWidth,t.board.node.clientHeight,e)}},20)},Game.prototype.start=function(){var t=this;t.timer=setInterval(function(){var e=t.duration--;document.getElementById("time").innerHTML=e,0==e&&t.stop()},1e3)},Game.prototype.stop=function(){clearInterval(this.timer),clearInterval(this.movement_timer),this.setState("timeup"),this.board.undrag();var t=this.score+DIAMOND_MULTIPIER*this.diamond;$("#final-score").text(t),$("#control-pane").show()},Game.prototype.setupLevel=function(){var t=this,e=this.level;this.level>MAX_LEVEL&&(e=MAX_LEVEL);var i=LEVEL_SETTING[e];console.log(i.objects),console.log(t.board.node.clientWidth),console.log(t.board.node.clientHeight),Object.keys(i.objects).forEach(function(e){for(var n=0;n<i.objects[e];n++){t.soundFX.play("addObject");var o=new Character(t,e,randomInRange(50,t.board.node.clientWidth-50),randomInRange(50,t.board.node.clientHeight-50));t.objects.push(o)}})},Game.prototype.setState=function(t){var e=t.toUpperCase();if(clearTimeout(this.statusCounter),STATE[e]!=this.state){if(console.log("Set State: "+t),Object.keys(STATE).indexOf(e)==-1)throw new Error("This state doesn't exist : "+e);this.board.removeClass(this.prevState),this.state=STATE[t.toUpperCase()],this.board.addClass(t),this.prevState=t}},Game.prototype.computeScore=function(){for(var t=this.objects.length/2,e=this.sepLine.originX,i=this.sepLine.originY,n=e+this.sepLine.dx,o=i+this.sepLine.dy,s={left:[],right:[]},r=0;r<this.objects.length;++r){var a=this.objects[r],h=a.attr("x"),c=a.attr("y"),d="right",p=checkLeftOrRight(e,i,n,o,h,c);p>0&&(d="left"),s[d][a.type]||(s[d][a.type]=0),s[d].push(a),s[d][a.type]++}var u=s.left.dog?s.left.dog:0,l=s.right.dog?s.right.dog:0,m=s.left.cat?s.left.cat:0,g=s.right.cat?s.right.cat:0,f=Math.abs(g-m)+Math.abs(l-u);0==f?this.awesome():this.soundFX.play("oh-no"),t-=f,t<0&&(t=0),this.score+=t;var v=BASE_SCORE*Math.pow(this.level,2);this.score>v?this.nextLevel():console.log("Next Level Score: ",v),document.getElementById("scoreboard").innerHTML=this.score},Game.prototype.nextLevel=function(){this.level=this.level+1,this.setupLevel()},Game.prototype.awesome=function(){this.diamond=this.diamond+1,this.soundFX.play("awesome"),this._animateSpecial("+",1)},Game.prototype._animateSpecial=function(t,e){var i=this;$("#special-animation").text(t+e),$("#special-animation").show(),$("#special-animation").fadeOut(function(){$("#special-item").text(i.diamond)})},Game.prototype.useSpecialItem=function(){function t(){v.board.unmousemove(),v.board.unclick(),console.log("FINISH SPECIAL"),v.computeScore(),g.remove(),f&&(console.log(f),f.remove()),v.setState("IDLE"),v.sepLine.removeClass("show")}if(this.diamond>=SPECIAL_ITEMS_TRADE&&this.state==STATE.IDLE){this.diamond=this.diamond-SPECIAL_ITEMS_TRADE,this._animateSpecial("-",SPECIAL_ITEMS_TRADE),this.setState("using_special_item");for(var e={cat:[],dog:[]},i=[],n=0;n<this.objects.length;n++){var o=this.objects[n],s=this.toOriginCoordinate(o.point());i.push(s),e[o.type].push(s.duality())}for(var r=Object.keys(e),a=[],n=0;n<r.length;n++){var h=r[n],c=this.ham.findMedian(e[h]);a.push(c)}var d=this.ham.findIntersection(a[0],a[1]),p=d.duality();p=this.ham.adjustSeparateLine(p,i);for(var i=this.originBoundary.intersectWithLine(p),u=0,l=0,n=0;n<i.length;n++){var s=i[n];i[n]=this.toCanvasCoordinate(s),u=i[n].x/i.length,l=i[n].y/i.length}var u=(i[0].x+i[1].x)/2,l=(i[0].y+i[1].y)/2,m=new Point(u,l),g=this.board.circle(m.x,m.y,10);g.attr("opacity",DRAG_OPACITY),this.setOriginSepLine(m);var f;DEBUG&&(f=this.board.line(i[0].x,i[0].y,i[1].x,i[1].y),f.attr({stroke:"#000"}));var v=this;v.sepLine.addClass("show"),v.board.mousemove(function(t){v.updateSepLine(m.x-t.x,m.y-t.y)});var y=setTimeout(function(){t()},2*DURATION.selecting);v.board.click(function(){clearTimeout(y),t()})}else this.diamond<SPECIAL_ITEMS_TRADE&&($("#special-item-wrapper").animate({opacity:0},200,"linear",function(){$(this).animate({opacity:1},200)}),this.soundFX.play("error"))},Game.prototype.setOriginSepLine=function(t){this.sepLine.originX=t.x,this.sepLine.originY=t.y},Game.prototype.updateSepLine=function(t,e){for(var i=[0,600],n=0;n<i.length;n++){var o="x"+(n+1);i[n]=t/e*(i[n]-this.sepLine.originY)+this.sepLine.originX,this.sepLine.attr(o,i[n])}this.sepLine.dx=t,this.sepLine.dy=e},Game.prototype.toOriginCoordinate=function(t){return new Point((t.x-this.board.node.clientWidth/2)/SCALING,(this.board.node.clientHeight/2-t.y)/SCALING)},Game.prototype.toCanvasCoordinate=function(t){var e=SCALING*t.x+this.board.node.clientWidth/2,i=this.board.node.clientHeight/2-SCALING*t.y;return new Point(e,i)};var DEBUG=!1;location.href.match(/debug=1/)&&(DEBUG=1);var game=new Game;