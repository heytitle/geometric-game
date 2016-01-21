function Character( game, name,x,y ){
    var size = 30;
    var obj = game.board.image(
        'images/characters/'+name + '.png',
        x,
        y,
        size,
        size
    );

    obj.type = name;
    obj.direction = Math.random()*plusOrMinus();

    obj.moveTurn = randomInRange(0,50);
    // console.log(obj.moveTurn);

    var directX = plusOrMinus();
    var directY = plusOrMinus();
    obj.move = function( rangeX, rangeY, velocity ){

        var oldX = parseInt(obj.attr('x'));
        var oldY = parseInt(obj.attr('y'));
        if( (++obj.moveTurn) == 50 ) {
            obj.moveTurn = 0;
            directX = plusOrMinus();
            directY = plusOrMinus();
            // console.log(directX, directY);
        }
        /* adjust x, y base on characteristic style; */
        delX = directX * velocity * MOVEMENT_CHARACTER[obj.type].speedX;
        delY = directY * velocity * MOVEMENT_CHARACTER[obj.type].speedY;

        oldX += delX;
        oldY += delY;

        if( oldX < size || oldX > ( rangeX - size ) ){
            oldX -= 2*delX;
            directX *= plusOrMinus();
            directY *= plusOrMinus();
        }
        if( oldY < size || oldY > ( rangeY - size ) ){
            oldY -= 2*delY;
            directX *= plusOrMinus();
            directY *= plusOrMinus();
        }
        obj.attr('x', oldX );
        obj.attr('y', oldY );
    }

    obj.point = function(){
        var width  = parseInt(obj.attr('width'));
        var height = parseInt(obj.attr('height'));
        var x      = parseFloat( obj.attr('x') );
        var y      = parseFloat( obj.attr('y') );

        return new Point(  x + width/2, y + height/2 )
    }

    return obj;
}
