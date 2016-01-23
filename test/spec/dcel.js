




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
});

describe('Construct Face', function () {
    it('normal case',function(){
        var face = new Face();
        face.initWithBoundary( new Point( -10,-10 ), new Point(10,10 ) );

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
});
