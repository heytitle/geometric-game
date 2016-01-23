var ACCEPTABLE_ERROR = 0.001;

function Point(x,y) {
    this.x = x;
    this.y = y;

}

Point.prototype.duality = function(){
    var line = new Line( 1, this.x, new Point(0, -this.y) );
    return line;
}

Point.prototype.distanceFromPoint = function( point ) {
    var deltaX = this.x - point.x;
    var deltaY = this.y - point.y;
    return Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY,2 ) );
}

Point.prototype.distanceFromOrigin = function(){
    return this.distanceFromPoint( new Point(0,0) );
}

Point.prototype.inBoundary = function( x1, y1, x2, y2 ) {
    /* Padding with 0.1 prevent floating point error ) */
    if(   this.x >= ( x1 - ACCEPTABLE_ERROR )
       && this.x <= ( x2 + ACCEPTABLE_ERROR )
       && this.y >= ( y1 - ACCEPTABLE_ERROR )
       && this.y <= ( y2 + ACCEPTABLE_ERROR )
    ){
        return true;
    }
    return false;

}

Point.prototype.isSamePoint = function(p) {
    return this.x == p.x && this.y == p.y;
}

Point.prototype.distanceToLine = function( line ) {
    var dominator = Math.sqrt( Math.pow( line.m, 2 ) + 1 );
    var cc = Math.abs(line.m * this.x - this.y + line.c);
    return cc/dominator;
}

function Line( dx, dy, point ){
    if( dx == 0 ){
        this.m = Infinity;
    }else {
        this.m = dy/dx;
    }

    this.c           = point.y - this.m * point.x;
    this.originPoint = point;

}

Line.prototype.findPointOnLine = function( x ) {
    var p = new Point(x,undefined);
    p.y = this.m*p.x + this.c;
    return p;
}

Line.prototype.isPointOnLine = function( point ){
    if( this.m == Infinity ) {
        return ( point.x == this.originPoint.x );
    }else {
        return this.findPointOnLine(point.x).y.toFixed(4) == point.y.toFixed(4);
    }
}

/* NOTE: For vertical line, above is equal to left. */
Line.prototype.isPointAbove = function( point ){

    /* Vertical Line */
    if( this.m == Infinity ) {
        return point.x <= this.originPoint.x;
    }
    /* end */

    return point.y >= this.findPointOnLine( point.x ).y;
}

Line.prototype.intersectWithLine = function( line ) {
    if( this.m == line.m ) { return null }

    var x;
    if( this.m == Infinity || line.m == Infinity ) {
        if( this.m == Infinity ) {
            x = this.originPoint.x;
        }else {
            x = line.originPoint.x;
        }
    }else {
        x = ( this.c - line.c ) / ( line.m - this.m );
    };

    var y = this.m * x + this.c;
    return new Point( x, y );
}

function Box( width, height ) {
    this.width = width;
    this.height = height;

    this.boundaries = [
        new Line( 1, 0, new Point(0,  this.height/2) ),
        new Line( 1, 0, new Point(0, -this.height/2) ),
        new Line( 0, 1, new Point( this.width/2, 0) ),
        new Line( 0, 1, new Point( -this.width/2, 0) )
    ];
}

Box.prototype.intersectWithLine = function( line ) {
    var intersect = [];
    for( var l=0; l < this.boundaries.length; l++ ) {
        var edge = this.boundaries[l];
        var p = line.intersectWithLine(edge);
        if( p.inBoundary( -this.width/2 ,-this.height/2 , this.width/2 , this.height/2) ) {
            intersect.push( p );
        }
    }
    return intersect;
}
