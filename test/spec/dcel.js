




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
    var face = new Face();
    face.initWithBoundary(new Point( -10,-10 ), new Point(10,10 ) );
    console.log(face.getIncidentEdges());
    it('normal case',function(){
        assert.equal(1,1);
        // assert.deepEqual(
        //     ham.findMedian(lines),
        //     [
        //         new Point( MIN_NUMBER, 0 ),
        //         new Point( 0, 0 ),
        //         new Point( 1, 1 ),
        //         new Point( 2, 0 ),
        //         new Point( MAX_NUMBER, 0 )
        //     ]
        // );
    });
});
