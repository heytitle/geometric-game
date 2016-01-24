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
        new Edge( vertices[2] ),
        new Edge( vertices[1] ),
        new Edge( vertices[0] )
    ];
    var attrs = ['next', 'prev'];
    for( var i = 0; i < 4; i++ ){
        var e = edges[i];
        var t = twinEdges[i];
        e.face = this;
        e.twin = t;
        t.twin = e;
        for( var j = 0; j < attrs.length; j++ ){
            var index = (i+1)%4;
            e[attrs[j]] = edges[index];
            t[attrs[j]] = twinEdges[index];
        }
        e.target.outGoingEdges.push( e.next );
        t.target.outGoingEdges.push( t.next );
    }
    this.halfedge = edges[0];
}

Face.prototype.getIncidentEdges = function( parseFN ){
    var next = this.halfedge;
    var edges = [];
    do {
        if( parseFN ){
            edges.push( parseFN(next) );
        }else {
            edges.push(next);
        }
        next = next.next;
    } while ( !next.isSameEdge( this.halfedge)  );
    return edges
}

Face.prototype.getVertices = function( parseFN ) {
    var vertices = this.getIncidentEdges( function(obj){
        var v = obj.target;
        if( parseFN ) {
            return parseFN(v);
        }
        return v;
    });
    return vertices;
}

function Edge( target ){
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

function Vertex(x,y) {
    this.coordinate = new Point(x,y);
    this.outGoingEdges = [];
}

Vertex.prototype.isSameVertex = function( v ){
    return this.coordinate.isSamePoint( v.coordinate );
}

function DCEL(edge){
    this.faces = [edge.face];

    /* Out-going edge from top left point */
	this.initialEdge = edge;
}

DCEL.prototype.addVertexAt = function(vertex, halfedge) {
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

DCEL.prototype.splitFace = function (halfedge, vertex) {
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
}

DCEL.prototype.addNewLine = function (line) {

}

