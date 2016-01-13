function HamSandwich(set1, set2) {
	this.set1 = set1;
	this.set2 = set2;
}

HamSandwich.prototype.findMedian = function(lines) {
	events = [new Point(Number.MIN_VALUE, Number.MIN_VALUE)];
	for (i = 0; i < lines.length - 1; ++i) {
		for (j = i + 1; j < lines.length; ++j) {
			m1 = lines[i].m;
			c1 = lines[i].c;
			m2 = lines[j].m;
			c2 = lines[j].c;

			x = (c2 - c1) / (m1 - m2);
			y = m1 * x + c1;
			events.push(new Point(x,y));
		}
	}

	pointCompare <- function(p1, p2) {
		return p1.x - p2.x;
	});

	events.sort(pointCompare);

	medianLines = [];
	medianPoints = [];
	for (Point p in events) {
		intersections = [];
		for (Line line in lines) {
			intersectionY = line.m * p.x + line.c;
			intersections.push(new Point(p.x, intersectionY);
		}
		intersections.sort(pointCompare);
		median = intersections[Math.round(intersections.length / 2)];

		for (Line line in lines) {
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
	medianPoints.push(new Point(lastX, lastY);
	return medianPoints;
}
