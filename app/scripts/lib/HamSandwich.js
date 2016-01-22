MIN_NUMBER = -65000;
MAX_NUMBER = 65000;

function HamSandwich(set1, set2) {
	this.set1 = set1; this.set2 = set2; }

HamSandwich.prototype.findMedian = function(lines) {
    /* Find 1st point */
    var firstPointCandidates = [];
    for( var i = 0; i < lines.length; i++ ) {
        var p = lines[i].findPointOnLine( MIN_NUMBER );
        firstPointCandidates.push(p);
    }

    firstPointCandidates.sort(this.sortPointBy('y'));

    var firstPoint = firstPointCandidates[Math.floor(lines.length/2)];
    /* End */

	events = [firstPoint];
	for (i = 0; i < lines.length - 1; i++) {
		for (j = i + 1; j < lines.length; j++) {
            var point = lines[i].intersectWithLine( lines[j] );
			events.push(point);
		}
	}

	events.sort(this.sortPointBy('x'));

	var medianLines = [];
	var medianPoints = [];
    var lastMedianLine;
	for ( var i = 0; i < events.length; i++) {
        var p = events[i];
		var intersections = [];

        for( var j = 0; j < lines.length; j++ ) {
            var line = lines[j];
			var intersectPoint = line.findPointOnLine(p.x);
			intersections.push(intersectPoint);
		}

		intersections.sort(this.sortPointBy('y'));

		median = intersections[Math.floor(intersections.length / 2)];

        for( var j = 0; j < lines.length; j++ ) {
            var line = lines[j];
			if (line.isPointOnLine(median)) {
				medianLines.push(line);
			}
		}

		if (medianLines[medianLines.length - 1].isPointOnLine(p)) {
			medianPoints.push(p);
            if( medianPoints.length == 1 ) {
                lastMedianLine = medianLines[0];
            }
		}
	}

    var lastPoint = medianLines[0].findPointOnLine( MAX_NUMBER );
	medianPoints.push(lastPoint);
	return medianPoints;
}

HamSandwich.prototype.findIntersection = function(pointList1, pointList2) {
	index1 = 0;
	index2 = 0;

	while (index1 < pointList1.length - 1 && index2 < pointList2.length - 1) {
		startPoint1 = pointList1[index1];
		endPoint1 = pointList1[index1 + 1];
		startPoint2 = pointList2[index2];
		endPoint2 = pointList2[index2 + 1];

		line1 = new Line(endPoint1.x - startPoint1.x, endPoint1.y - startPoint1.y, startPoint1);
		line2 = new Line(endPoint2.x - startPoint2.x, endPoint2.y - startPoint2.y, startPoint2);

		intersection = line1.intersectWithLine(line2);

		if (intersection != null
				&& (intersection.x - startPoint1.x) * (intersection.x - endPoint1.x) <= 0
				&& (intersection.y - startPoint2.y) * (intersection.y - endPoint2.y) <= 0) {

			return intersection;
		}

		if (pointList1[index1 + 1].x > pointList2[index2 + 1].x) {
			index2++;
		} else {
			index1++;
		}
	}

	return undefined;
}

HamSandwich.prototype.adjustSeparateLine = function( line, points ){
    var count = [[],[]];
    for( var i = 0; i < points.length; i++ ){
        var p = points[i];
        if( !line.isPointOnLine(p) ) {
            var index = 0;
            if( !line.isPointAbove(p) ){
                index = 1;
            }
            count[index].push(p);
        }else {
            // console.log(p);
        }
    }

    var biggestGroup;
    var factor = 1;
    if( count[0].length > count[1].length ){
        biggestGroup = count[0];
    } else if( count[0].length < count[1].length ){
        factor = -1;
        biggestGroup = count[1];
    } else {
        console.log('not shift');
        return line;
    }

    biggestGroup = biggestGroup.sort( function(a,b){
        return a.distanceToLine( line ) - b.distanceToLine( line );
    });

    var dist = biggestGroup[0].distanceToLine(line)/2;
    line.c = line.c  + factor * dist;
    return line;
}

HamSandwich.prototype.sortPointBy = function( by ) {
    return function( p1, p2 ) {
        return p1[by] - p2[by];
    }
};
