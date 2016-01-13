console.log('xxx');
var RADIUS = 5;
var STOKE_WITDH=5;
var SCALING = 30;

var normalPane = Snap("#normal-pane");
var dualPane = Snap("#dual-pane");

var HEIGHT = normalPane.node.offsetHeight;
var WIDTH  = normalPane.node.offsetWidth;

var SCALED_HEIGHT = HEIGHT/SCALING;
var SCALED_WIDTH = WIDTH/SCALING;

var papers = [ normalPane, dualPane ];
for( var i = 0; i < papers.length; i++ ) {
    var paper = papers[i];
    var l = paper.line( 0, HEIGHT/2, WIDTH, HEIGHT/2 );
    l.attr({stroke: '#000'});
    var l2 = paper.line( WIDTH/2, 0, WIDTH/2, HEIGHT );
    l2.attr({stroke: '#000'});
}

var COLOR_PROFILE = {
    0: '#FF0000',
    1: '#0000FF'
};

var boundaries = [
    // Horizontal Line
    new Line( 1, 0, new Point(0,SCALED_HEIGHT/2) ),
    new Line( 1, 0, new Point(0,-SCALED_HEIGHT/2) ),

    // Vertical Line
    new Line( 0, 1, new Point( SCALED_WIDTH/2, 0 ) ),
    new Line( 0, 1, new Point( -SCALED_WIDTH/2,0 ) )
];

var color = 0;
function mapCoordinate(x,y){
    return new Point( (x - WIDTH/2)/SCALING , (HEIGHT/2 - y)/SCALING );
}
normalPane.click(function(e){
    var circle = normalPane.circle( e.x, e.y, RADIUS );
    var point = mapCoordinate( e.x,e.y );
    var c = COLOR_PROFILE[color];
    circle.attr({fill:  c });
    /* Draw a Line on dualPane that intersected with 2 edges of dualPane boudary*/
    var dualLine = point.duality();
    // dualLine.m = dualLine.m/10;
    // dualLine.c = dualLine.c/10;
    var intersect = [];
    console.log(point);
    console.log(dualLine);
    for( var l=0; l < boundaries.length; l++ ) {
        var line = boundaries[l];
        var p = dualLine.intersectWithLine(line);
        if( p.inBoundary( -SCALED_WIDTH/2,-SCALED_HEIGHT/2, SCALED_WIDTH/2, SCALED_HEIGHT/2 ) ) {
            intersect.push(p);
        }
    }
    // }
    console.log(intersect);
    for( var i = 0; i < 2; i++ ){
        intersect[i].x = SCALING*( intersect[i].x + SCALED_WIDTH/2 );
        intersect[i].y = SCALING*( SCALED_HEIGHT/2 - intersect[i].y  );
    }

    // console.log(intersect);

    line = dualPane.line(
        intersect[0].x,
        intersect[0].y,
        intersect[1].x,
        intersect[1].y
    );
    line.attr({ stroke: c } );

    circle.hover(function(){
        line.attr({strokeWidth:3});
    },function(){
        line.attr({strokeWidth:1});
    });
    /* End Line Drawing */
    //normalPane.node.offsetWidth;

    color = ( color + 1 ) % 2;
});

