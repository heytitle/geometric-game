




'use strict';
var assert = require('assert');
var fs = require('fs');
var geo = fs.readFileSync('./app/scripts/lib/Geo.js','utf-8');
var myCode = fs.readFileSync('./app/scripts/lib/DCEL.js','utf-8');

eval.call(null,geo);
eval.call(null,myCode);

describe('Edge', function(){
    describe('check same edge', function(){
        it('normal case', function(){
            var prev = new Edge( new Vertex(-10,-10) );
            var e1   = new Edge( new Vertex(0,0) );
            var e2   = new Edge( new Vertex(0,0) );
            e1.prev = prev;
            e2.prev = prev;
            assert.ok( e1.isSameEdge(e2) );
        });

        it('incorrect case', function(){
            var prev = new Edge( new Vertex(-10,-10) );
            var e1   = new Edge( new Vertex(0,0) );
            var e2   = new Edge( new Vertex(2,0) );
            e1.prev = prev;
            e2.prev = prev;
            assert.ok( !e1.isSameEdge(e2) );
        });
    });

    describe('intersect with line', function(){
        var e;
        beforeEach(function(){
            e = newEdge(0,0, 5,5);
        });
        it('intersect', function(){
            var v = e.intersectWithLine(
                new Line( 1, 0, new Point( 0, 2 ) )
            );
            assert.deepEqual( v.coordinate, {x: 2, y: 2});
        });
    });
});

describe('Face', function () {
    var face;

    beforeEach(function() {
        face = new Face();
        face.initWithBoundary( new Point( -10,-10 ), new Point(10,10 ) );
    });

    it('Construct Face',function(){

        var incEdges = face.getIncidentEdges(function( obj ){
            return { target: obj.target.coordinate };
        });


        assert.deepEqual( incEdges,
            [
                { target: { x: -10, y: -10 }},
                { target: { x: 10, y: -10  }},
                { target: { x: 10, y: 10   }},
                { target: { x: -10, y: 10  }}
            ],
            "Correct edges"
        );

        var vertices = face.getVertices( function(obj) {
            return {
                x: obj.coordinate.x,
                y: obj.coordinate.y,
                outGoingEdges: obj.outGoingEdges.length
            };
        });

        assert.deepEqual( vertices,
            [
                { x: -10, y: -10, outGoingEdges: 2 },
                { x: 10, y: -10, outGoingEdges: 2 },
                { x: 10, y: 10, outGoingEdges: 2 },
                { x: -10, y: 10, outGoingEdges: 2 }
            ],
            "Correct vertices"
        );
    });
    describe("Check Intersect with line", function(){
        it("Intersect", function(){
            var l = new Line(1,1, new Point(0,0) );
        });

        it("Miss", function(){
        });
    });
});

describe("DCEL", function(){
    it("Add vertex", function(){
        var f  =  new Face();
        var v1 = new Vertex(-10,-10);
        var v2 = new Vertex(0,0);
        var v3 = new Vertex(10,10);

        var h     = new Edge( v2 );
        v2.outGoingEdges.push(h);
        var hTwin = new Edge( v1 );
        var hNext = new Edge( v3 );

        h.face     = f;
        hNext.face = f;

        h.twin    = hTwin;
        h.next    = hNext;

        var dcel = new DCEL(h);
        var newVertex = new Vertex( -5, 5 );

        dcel.addVertexAt( newVertex, h );
        assert.deepEqual( newVertex.outGoingEdges[0].next , hNext );
        assert.deepEqual( h.next, newVertex.outGoingEdges[0].twin );
        assert.deepEqual( h.next.target , newVertex );
        assert.deepEqual( h.next.twin , newVertex.outGoingEdges[0] );
        assert.deepEqual( newVertex.outGoingEdges[0].target, v2 );
        assert.deepEqual( v2.outGoingEdges.length, 2 );

        assert.deepEqual( h.next.face, f );
        assert.deepEqual( newVertex.outGoingEdges[0].face, f );

    });
});

function newEdge( x1,y1, x2,y2 ) {

    var v1 = new Vertex( x1,y1 );
    var v2 = new Vertex( x2, y2 );

    var e = new Edge( v2 );
    var ePrev = new Edge( v1  );
    e.prev = ePrev;
    return e;
}
