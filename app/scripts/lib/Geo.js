function Point(x,y) {
    this.x = x;
    this.y = y;
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
        return this.findPointOnLine(point.x).y == point.y;
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
