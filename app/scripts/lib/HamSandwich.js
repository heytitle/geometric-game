MIN_NUMBER = -65000;
MAX_NUMBER = 65000;

function HamSandwich(set1, set2) {
	this.set1 = set1;
	this.set2 = set2;
}

HamSandwich.prototype.findMedian = function(lines) {
	events = [new Point(MIN_NUMBER, 0)];
	for (i = 0; i < lines.length - 1; i++) {
		for (j = i + 1; j < lines.length; j++) {
            var point = lines[i].intersectWithLine( lines[j] );
			events.push(point);
		}
	}

	pointCompare = function(p1, p2) {
        if( p1.x > p2.x ) {
            return 1;
        }
        if( p1.x< p2.x ) {
            return -1;
        }
        return 0;
	};

	events.sort(pointCompare);

	var medianLines = [];
	var medianPoints = [];
    var lastMedianLine;
	for ( var i = 0; i < events.length; i++) {
        var p = events[i];
		var intersections = [];

        for( var j = 0; j < lines.length; j++ ) {
            var line = lines[j];
			intersectionY = line.m * p.x + line.c;
			intersections.push(new Point(p.x, intersectionY));
		}

		intersections.sort(function(p1,p2){
            return p1.y - p2.y;
        });
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

	lastX = MAX_NUMBER;
	lastY = lastMedianLine.m * lastX + lastMedianLine.c;
	medianPoints.push(new Point(lastX, lastY));
	return medianPoints;
}
