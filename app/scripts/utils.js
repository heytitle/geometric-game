function randomInRange( min, max ) {
    return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

function plusOrMinus(){
    if( Math.random() > 0.5 ) {
        return 1;
    }
    return -1;
}

function checkLeftOrRight(startX, startY, endX, endY, pointX, pointY){
	return ((endX - startX)*(pointY - startY)
			- (endY - startY)*(pointX - startX));
}

function setTextForDOM( id, text ){
    document.getElementById(id).innerHTML = text;
}

function hideDOM(id) {
    console.log(id);
    document.getElementById(id).style.display = "none";
}

function showDOM(id, style) {
    style = style || 'block';
    document.getElementById(id).style.display = style;
}
