var DEBUG = false;
if( location.href.match(/debug=1/) ) {
    DEBUG = 1;
}

var game = new Game();

function startGame() {
    $('#control-pane').hide();
    $('#start-pane').hide();
    $('#end-pane').css('display', 'table');
    game.init();
}

function replay() {
    $('#control-pane').hide();
    game.replay();
}
