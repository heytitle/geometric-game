console.log('\'Allo \'Allo!');
var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

var HEIGHT = 600;
var WIDTH = 800;
var timeWhenGameStarted = Date.now();   //return time in ms


var Img = {};

Img.animal1 = new Image();
Img.animal1.src = './images/characters/Emoji Natur-01.png';

Img.animal2 = new Image();
Img.animal2.src = './images/characters/Emoji Natur-02.png';

Img.animal3 = new Image();
Img.animal3.src = './images/characters/Emoji Natur-60.png';


var enemyList = {};



Enemy = function (id,x,y,spdX,spdY,width,height , img){
    var enemy3 = {
        x:x,
        spdX:spdX,
        y:y,
        spdY:spdY,
        name:'E',
        id:id,
        width:width,
        height:height,
        img:img,
    };
    enemyList[id] = enemy3;

}

var started = false;
var x0 = 0 ;
var y0 = 0 ;
var x1 = 0 ;
var y1 = 0 ;
document.onmousedown = function(mouse){
    started = true;
    x0 = mouse.clientX;
    y0 = mouse.clientY;
}
document.onmousemove = function(mouse){
    if (!started) {
        return;
    }
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    for(var key in enemyList){
        drawEntity(enemyList[key]);
    }
    x1 = mouse.clientX;
    y1 = mouse.clientY;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1 );
    ctx.stroke();
    ctx.closePath();
}

document.onmouseup = function(mouse){
    started = false;
    ctx.save();
}




updateEntity = function (something){
    updateEntityPosition(something);
    drawEntity(something);
}
updateEntityPosition = function(something){
    something.x += something.spdX;
    something.y += something.spdY;

    if(something.x < 0 || something.x > WIDTH){
        something.spdX = -something.spdX;
    }
    if(something.y < 0 || something.y > HEIGHT){
        something.spdY = -something.spdY;
    }
}




drawEntity = function(something){
    ctx.save();
    var x = something.x-something.width/2  ;
    var y = something.y-something.height/2
    ctx.drawImage(something.img,
                  0,0,something.img.width,something.img.height,
                  x,y,60,60);
                  ctx.restore();
}



update = function(){
    //if (started) {
    //		return;
    //	}
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1 );
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.lineWidth=7;
    ctx.closePath();
    for(var key in enemyList){
        updateEntity(enemyList[key]);
    }

}

Enemy('E1',20,350,10,15,30,30 , Img.animal1 );
Enemy('E2',25,350,10,-15,20,20, Img.animal3 );
Enemy('E3',50,150,10,-8,40,10, Img.animal2);
Enemy('E4',250,200,10,-8,40,10, Img.animal1 );
Enemy('E5',250,300,10,-8,40,10, Img.animal3 );
Enemy('E6',100,300,10,-8,40,10, Img.animal2  );

setInterval(update,100);
