function Face( edge ){
	this.halfedge = edge ;
}

Face.prototype.initWithBoundary = function( bottomLeft, topRight ){
    // 4 - 3
    // |   |
    // 1 - 2
    var x1,y1,x2,y2;
    x1 = bottomLeft.x;
    y1 = bottomLeft.y;
    x2 = topRight.x;
    y2 = topRight.y;


    var vertices = [
        new Vertex(x1,y1),
        new Vertex(x2,y1),
        new Vertex(x2,y2),
        new Vertex(x1,y2)
    ];

    var edges = [
        new Edge( vertices[0] ),
        new Edge( vertices[1] ),
        new Edge( vertices[2] ),
        new Edge( vertices[3] )
    ];
    var twinEdges = [
        new Edge( vertices[3] ),
        new Edge( vertices[0] ),
        new Edge( vertices[1] ),
        new Edge( vertices[2] )
    ];
    var attrs = ['next', 'prev'];
    for( var i = 0; i < 4; i++ ){
        var e = edges[i];
        var t = twinEdges[i];
        e.setTwin(t);
        e.face = this;

        for( var j = 0; j < attrs.length; j++ ){
            var index = ( 4*j + (i+Math.pow(-1, j) * 1) )%4;
            e[attrs[j]] = edges[index];
        }
        e.target.outGoingEdges.push( e.next );
    }

    twinEdges[0].prev = twinEdges[1];
    twinEdges[1].prev = twinEdges[2];
    twinEdges[2].prev = twinEdges[3];
    twinEdges[3].prev = twinEdges[0];

    twinEdges[0].next = twinEdges[3];
    twinEdges[1].next = twinEdges[0];
    twinEdges[2].next = twinEdges[1];
    twinEdges[3].next = twinEdges[2];

    for( var i = 0 ; i < twinEdges.length; i++ ) {
     var t = twinEdges[i];
      t.target.outGoingEdges.push( t.next );
    }
    this.halfedge = edges[0];
}

Face.prototype.getIncidentEdges = function( parseFN ){
    var edges = [];
    this.traverseIncidentEdges( function(obj){
        if( parseFN ) {
            edges.push(parseFN(obj));
        } else {
            edges.push(obj);
        }
    });
    return edges
}

Face.prototype.traverseIncidentEdges = function( parseFN ) {
    var start = this.halfedge.prev.target;
    var next = this.halfedge;
    do {
        // console.log( next.toJSON() );
        if( parseFN ){
            parseFN(next);
        }else {
            console.log( next );
        }
        next = next.next;
    } while ( !next.prev.target.isSameVertex( start )  );
}

Face.prototype.getVertices = function( parseFN ) {
    var vertices = [];
    this.traverseIncidentEdges( function(edge){
        var v = edge.target;
        if( parseFN ) {
            vertices.push(parseFN(v));
        }else {
            vertices.push(v);
        }
    });
    return vertices;
}

Face.prototype.toJSON = function(){
    return this.getVertices(function(obj){
        return obj.coordinate;
    });
}

Face.prototype.intersectWithLine = function( line ) {
    var intersect = [];
    this.traverseIncidentEdges( function(edge){
        var v = edge.intersectWithLine(line);
        if( v ) {
            intersect.push(v);
        }
    });

    if( intersect.length == 2 ) { return intersect }
    return;
}

Face.prototype.splitFaceByLine = function( line ){
    var intersect = this.intersectWithLine( line );
    var edge;
    for( var i = 0; i < intersect.length; i++ ){
        this.traverseIncidentEdges(function(e){
            if( e.isPointOnEdge( intersect[i] ) ){
                edge = e;
            }
        });
        this.addVertexOnEdge( intersect[i], edge );
    }

	this.traverseIncidentEdges(function(e) {
		if( e.target.isSameVertex( intersect[0] ) ) {
			edge = e;
		}
	});


	var res = this.splitFace( edge, intersect[1] );

    return res;
}

function Edge(target){
    this.target = target;

    this.next;
    this.prev;
    this.face;
    this.twin;
}

Edge.prototype.origin = function(){
    return this.prev.target;
}

Edge.prototype.isSameEdge = function( edge ){
    var sameTarget = edge.target.isSameVertex( this.target );
    var sameOrigin = this.origin().isSameVertex( edge.origin() );
    return sameTarget && sameOrigin;
}

Edge.prototype.intersectWithLine = function( line ){
    var origin = this.origin().coordinate;
    var target = this.target.coordinate;

    var thisLine = new Line(
        origin.x - target.x,
        origin.y - target.y,
        origin
    );


    var p = thisLine.intersectWithLine(line);

    var xs = [ origin.x, target.x ].sort();
    var ys = [ origin.y, target.y ].sort();

    if( p && p.inBoundary( xs[0], ys[0], xs[1], ys[1] )){
        return new Vertex( p.x, p.y );
    }
}

Edge.prototype.isPointOnEdge = function( v ) {
    var origin = this.origin().coordinate;
    var target = this.target.coordinate;

    var thisLine = new Line(
        origin.x - target.x,
        origin.y - target.y,
        origin
    );

    var xs = [ origin.x, target.x ].sort();
    var ys = [ origin.y, target.y ].sort();

    var p = thisLine.isPointOnLine(v.coordinate);

    if( p && v.coordinate.inBoundary( xs[0], ys[0], xs[1], ys[1] )){
        return true;
    }
    return false;
}

Edge.prototype.setTwin = function( e ) {
    this.twin = e;
    e.twin = this;
}

Edge.prototype.setOrigin = function( v ) {
    var oldOrigin = this.origin();
    oldOrigin.removeEdge(this);
    v.outGoingEdges.push(this);
};

Edge.prototype.traverse = function(parseFN){
    var next = this;
    do {
        if(parseFN){
            parseFN(next);
        }else{
            console.log(next);
        }
        next = next.next;
    } while( !next.isSameEdge( this ) )
}

Edge.prototype.toJSON = function(){
    return {
        origin: this.origin().coordinate,
        target: this.target.coordinate
    }
}

function Vertex(x,y) {
    this.coordinate = new Point(x,y);
    this.outGoingEdges = [];
}

Vertex.prototype.isSameVertex = function( v ){
    return this.coordinate.isSamePoint( v.coordinate );
}

Vertex.prototype.removeEdge = function( e ) {
    for( var i = 0; i < this.outGoingEdges.length; i++ ){
        var v = this.outGoingEdges[i];
        if( e.isSameEdge( v ) ){
            this.outGoingEdges.splice(i,1);
            break;
        }
    }
}

function DCEL(){
    // this.faces = [edge.face];

    /* Out-going edge from top left point */
}

Face.prototype.addVertexAt = function(vertex, halfedge) {
	h1 = new Edge(vertex);
	h2 = new Edge(halfedge.target);

	vertex.outGoingEdges.push(h2);
	h1.twin = h2;
	h2.twin = h1;
	h1.face = halfedge.face;
	h2.face = halfedge.face;
	h1.next = h2;
	h2.next = halfedge.next;
	h1.prev = halfedge;
	h2.prev = h1;
	halfedge.next = h1;
	h2.next.prev = h2;

    halfedge.target.outGoingEdges.push(h1);
}

Face.prototype.addVertexOnEdge = function( vertex, edge) {
	var v1 = edge.target;
	var v2 = edge.twin.target;

	v1.removeEdge(edge.twin);
	v2.removeEdge(edge);

	halfedge1 = edge.prev;
	halfedge2 = edge.next.twin;

    this.addVertexAt( vertex, halfedge1 );
    this.addVertexAt( vertex, halfedge2 );

	halfedge1.twin.prev = halfedge1.next.twin;
	halfedge2.twin.prev = halfedge2.next.twin;

	halfedge1.next.next = halfedge2.next.twin;
	halfedge2.next.next = halfedge1.next.twin;

	halfedge1.next.twin.prev = halfedge2.next;
	halfedge2.next.twin.prev = halfedge1.next;

	halfedge1.next.twin.next = halfedge1.twin;
	halfedge2.next.twin.next = halfedge2.twin;

    this.halfedge = halfedge1.next;
}

Face.prototype.splitFace = function (halfedge, vertex) {
	if (!halfedge || ! vertex) { return }

	h1 = new Edge(vertex);
	h2 = new Edge(halfedge.target);
	f1 = new Face(h1);
	f2 = new Face(h2);
	h1.twin = h2;
	h2.twin = h1;
	h2.next = halfedge.next;
	h2.next.prev = h2;
	h1.prev = halfedge;
	halfedge.next = h1;

	i = h2;
	while ( true ) {
		i.face = f2;
		if (i.target.isSameVertex(vertex)) {
			break;
		}
		i = i.next;
	}

	h1.next = i.next;
	h1.next.prev = h1;
	i.next = h2;
	h2.prev = i;

	i = h1;
	while (true) {
		i.face = f1;
		if ( i.target.isSameVertex(halfedge.target) ) {
			break;
		}
		i = i.next;
	}

	halfedge.target.outGoingEdges.push(h1);
	vertex.outGoingEdges.push(h2);
	return h1;
}

DCEL.prototype.buildArrangement = function(lines) {
	var f = new Face();
	f.initWithBoundary(new Point(MIN_NUMBER, MIN_NUMBER), new Point(MAX_NUMBER, MAX_NUMBER));
	var representativeHalfedges = [f.halfedge];

	for (var i = 0; i < lines.length; ++i) {
		var line = lines[i];
        var splittedRepEdges = [];
        var oldEdges = [];
        var traversedFaces = [];
        console.log('>>>>> Line ' + i );
        debug( 0 ,' rep haft edges ', representativeHalfedges );
        for (var j = 0; j < representativeHalfedges.length; ++j) {
            var currentFace = representativeHalfedges[j].face;
            var neighborFace = representativeHalfedges[j].twin.face;

            console.log('>>> Face ' + j);
            console.log( currentFace.toJSON() );
            if(neighborFace){
                console.log(neighborFace.toJSON());
                console.log( neighborFace.intersectWithLine(line) );
            }

            if (currentFace && currentFace.intersectWithLine(line) && traversedFaces.indexOf(currentFace) == -1 ) {
                console.log('Current');
                oldEdges.push(currentFace.halfedge);
                splittedRepEdges.push(currentFace.splitFaceByLine(line));
                traversedFaces.push(currentFace);
            }

            if(neighborFace && neighborFace.intersectWithLine(line) ) {
                oldEdges.push(neighborFace.halfedge);
                splittedRepEdges.push(neighborFace.splitFaceByLine(line));
                traversedFaces.push(neighborFace);
            }
            debug(2, " > Old edge ", oldEdges );
            console.log("\n\n");

        }

        for (var j = 0; j < oldEdges.length; ++j) {
            index = representativeHalfedges.indexOf(oldEdges[j]);
            if( index >= 0 ){
                representativeHalfedges.splice(index, 1);
            }
        }

        for (var j = 0; j < splittedRepEdges.length; ++j) {
            representativeHalfedges.push(splittedRepEdges[j]);
        }
        debug( 0, " representativeHalfedges ", representativeHalfedges );

        console.log("-----> All Face after adding line " + i );
        for( var k = 0; k < representativeHalfedges.length; k++ ) {
            var r = representativeHalfedges[k];
            console.log( r.face.toJSON());
            if( r.twin.face ){
                console.log( r.twin.face.toJSON());
            }
        }
        console.log("--------------------------------");
	}

	this.halfedges = representativeHalfedges;
}

function debug( no, caseName, arr, func ){
    var tab = Array(no*4).join(" ");
    console.log(tab+">>>>>>>> "+caseName +" <<<<<<< ");
    for( var i = 0; i < arr.length; i++ ){
        // if(func){
        //     func( arr[i] );
        // }
        console.log(tab+ JSON.stringify(arr[i].toJSON()) );
    }
    console.log(tab+"-------------");
}
