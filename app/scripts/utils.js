function randomInRange( min, max ) {
    return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

function plusOrMinus(){
    if( Math.random() > 0.5 ) {
        return 1;
    }
    return -1;
}
