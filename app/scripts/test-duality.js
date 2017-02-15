var RADIUS = 5;
var STOKE_WITDH=5;
var SCALING = 30;

var normalPane = Snap("#normal-pane");
var dualPane = Snap("#dual-pane");

var HEIGHT = normalPane.node.clientHeight;
var WIDTH  = normalPane.node.clientWidth;

var SCALED_HEIGHT = HEIGHT/SCALING;
var SCALED_WIDTH = WIDTH/SCALING;

var ham = new HamSandwich();

var medianLines = [[],[]];

var toggle = {};

var points = [[],[]];

$(document).ready(function(){
    $("#show-median").click(function(){
        var lines = [[],[]];
        for( var i = 0; i < 2; i++ ){
            var medianPoints = ham.findMedian( medianLines[i] );
            lines[i] = medianPoints;
            /* Draw Circle */
            for( var j = 0; j < medianPoints.length; j++ ){
                var p = medianPoints[j];
                p = convertPointToCanvasCoordinate(p);
                var circle = dualPane.circle( p.x, p.y, RADIUS );
                circle.attr({fill:  COLOR_PROFILE[i] });
                circle.addClass('color-'+i);
            }
        }

        var point = ham.findIntersection( lines[0], lines[1] );
        var line  = point.duality();
        if( $('#shifting').prop("checked") ){
            line = ham.adjustSeparateLine( line, points[0].concat(points[1]) );
        }

        var canvasPoints = intersectWithBoundary(line);
        var line = normalPane.line(
            canvasPoints[0].x,
            canvasPoints[0].y,
            canvasPoints[1].x,
            canvasPoints[1].y
        );
        line.attr({ stroke: '#000' } );
    });

    $(".toggle-button").click(function(){
        var id = $(this).attr('id');
        if( !toggle[id] ) {
            $("."+id).hide();
        }else {
            $("."+id).show();
        }
        toggle[id] = !toggle[id];
    });
});

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

    points[color].push(point);
    /* Draw a Line on dualPane that intersected with 2 edges of dualPane boudary*/
    var dualLine = point.duality();

    medianLines[color].push( dualLine );

    var intersect = intersectWithBoundary(dualLine);
    var line = dualPane.line(
        intersect[0].x,
        intersect[0].y,
        intersect[1].x,
        intersect[1].y
    );
    line.attr({ stroke: c } );
    line.addClass('color-'+color);

    circle.hover(function(){
        line.attr({strokeWidth:3});
    },function(){
        line.attr({strokeWidth:1});
    });

    $("#test-case").text( JSON.stringify(points) );

    /* End Line Drawing */
    color = ( color + 1 ) % 2;
});

function intersectWithBoundary(line) {
    var intersect = [];
    for( var l=0; l < boundaries.length; l++ ) {
        var edge = boundaries[l];
        var p = line.intersectWithLine(edge);
        if( p.inBoundary( -SCALED_WIDTH/2 ,-SCALED_HEIGHT/2 , SCALED_WIDTH/2 , SCALED_HEIGHT/2) ) {
            intersect.push( convertPointToCanvasCoordinate(p) );
        }
    }
    return intersect;
}

function convertPointToCanvasCoordinate( p ) {
    var x = SCALING*( p.x + SCALED_WIDTH/2 );
    var y = SCALING*( SCALED_HEIGHT/2 - p.y  );
    return new Point(x,y);
}
