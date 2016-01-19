'use strict';
var assert = require('assert');
var fs = require('fs');
var myCode = fs.readFileSync('./app/scripts/lib/Geo.js','utf-8');

eval.call(null,myCode);

describe('Point', function () {
    it('create point', function(){
        var p = new Point(10,20);
        assert.equal(p.x, 10 );
        assert.equal(p.y, 20 );
    });

    it('duality', function(){
        var p = new Point(2,5);
        var l = p.duality();

        assert.equal( l.m, 2 );
        assert.equal( l.c, -5 );
        assert.equal( l.originPoint.y, -5 );
    });

    it('distanceFromPoint', function(){
        var p = new Point(3,4);
        var origin = new Point(0,0);
        assert.equal( p.distanceFromPoint(origin), 5 );
    });

    it('pointInBoundary', function(){
        var points = [
            {
                p: [3,4],
                expect: true
            },
            {
                p: [-10.000001,4],
                expect: true
            },
            {
                p: [-11,4],
                expect: false
            }
        ];
        for( var i = 0; i < points.length; i++ ){
            var c = points[i];
            var p = new Point(c.p[0], c.p[1]);
            assert.equal(
                p.inBoundary( -10, -10, 10, 10 ),
                c.expect,
                '(x,y) : ('+c.p[0]+","+c.p[1]+")"
            );
        }
    });
});

describe('Line', function(){
    it('regular and horizontal line', function(){
        var p = new Point( 1, 1 );
        var l = new Line( 1, 5, p );
        assert.equal( l.m, 5, 'Correct slope' );
        assert.equal( l.c, -4, 'Correct c' );

        assert.ok( l.isPointOnLine( new Point( 2, 6 ) ), 'Point is on the line' );
        assert.ok( !l.isPointOnLine( new Point( 2, 3 ) ), 'Point is NOT on the line' );

        assert.ok( l.isPointAbove( new Point( 2, 10 ) ), 'Point is above the line.' );
        assert.ok( !l.isPointAbove( new Point( 2, 3 ) ), 'Point is below the line.' );
    });

    it('vertical line', function(){
        var p = new Point(5,2);
        var l = new Line( 0, 6, p );
        assert.equal( l.m, Infinity, 'Slope is zero' );
        assert.equal( l.c, -Infinity, 'Correct c');
        assert.ok( l.isPointOnLine( new Point( 5, -10 ) ), 'Point is on the line' );
        assert.ok( !l.isPointOnLine( new Point( 10, 3 ) ), 'Point is NOT on the line' );

        assert.ok( l.isPointAbove( new Point( 3, 2 ) ), 'Point is above the line.' );
        assert.ok( !l.isPointAbove( new Point( 10, 3 ) ), 'Point is below the line.' );
    });


    describe('line intersection', function(){
        var l1 = new Line( 1, 1, new Point( 0, 1 ) );
        var l2 = new Line( 1, 2, new Point( 0, 0 ) );

        it('different slope', function(){
            var p = l1.intersectWithLine(l2);
            assert.equal( p.x, 1 );
            assert.equal( p.y, 2 );
        });

        it('same slope', function(){
            var l3 = new Line( 1, 1, new Point( 0, 3 ) );
            var p = l1.intersectWithLine( l3 );
            assert.ok( !p, 'No intersection point' );
        });

        it('intersect with vertical line', function(){
            var l4 = new Line( 0, 5, new Point(5,10) );

            var p = l1.intersectWithLine(l4);
            assert.equal( p.x, 5 );
            assert.equal( p.y, 6 );
        });
    });

});
