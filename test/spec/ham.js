'use strict';
var assert = require('assert');
var fs = require('fs');
var geo = fs.readFileSync('./app/scripts/lib/Geo.js','utf-8');
var myCode = fs.readFileSync('./app/scripts/lib/HamSandwich.js','utf-8');

eval.call(null,geo);
eval.call(null,myCode);

describe('findMedian', function () {
    it('',function(){
        var ham = new HamSandwich();
        var lines = [
            new Line(1,0, new Point(0, 0) ),
            new Line(1,1, new Point(0, 0) ),
            new Line(1,-1, new Point(0,2) )
        ];

        assert.deepEqual(
            ham.findMedian(lines),
            [
                new Point( MIN_NUMBER, 0 ),
                new Point( 0, 0 ),
                new Point( 1, 1 ),
                new Point( 2, 0 ),
                new Point( MAX_NUMBER, 0 )
            ]
        );
    });
});
