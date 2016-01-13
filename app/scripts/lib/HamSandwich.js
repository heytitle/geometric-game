function HamSandwich(set1, set2) {
	this.set1 = set1;
	this.set2 = set2;
}

HamSandwich.prototype.findMedian = function(lines) {
	events = [new Point(Number.MIN_VALUE, Number.MIN_VALUE)];
	for (i = 0; i < lines.length - 1; i++) {
		for (j = i + 1; j < lines.length; j++) {
            var point = lines[i].intersectWithLine( lines[j] );
			events.push(point);
		}
	}

	pointCompare = function(p1, p2) {
		return p1.x - p2.x;
	};

	events.sort(pointCompare);

	var medianLines = [];
	var medianPoints = [];
	for ( var i = 0; i < events.length; i++) {
        var p = events[i];
		var intersections = [];

        for( var j = 0; j < lines.length; j++ ) {
            var line = lines[j];
			intersectionY = line.m * p.x + line.c;
			intersections.push(new Point(p.x, intersectionY));
		}

		intersections.sort(pointCompare);
		median = intersections[Math.round(intersections.length / 2)];

        for( var j = 0; j < lines.length; j++ ) {
            var line = lines[j];
			if (line.isPointOnLine(median)) {
				if (medianLines.length == 0) {
					x = Number.MIN_VALUE;
					y = line.m * x + line.c;
					medianPoints.push(new Point(x, y));
				}

				medianLines.push(line);
			}
		}

		if (medianLines[medianLines.length - 1].isPointOnLine(p)) {
			medianPoints.push(p);
		}
	}

	lastMedianLine = medianLines[medianLines.length - 1];
	lastX = Number.MAX_VALUE - 1000;
	lastY = lastMedianLine.m * lastX + lastMedianLine.c;
	medianPoints.push(new Point(lastX, lastY));
	return medianPoints;
}
