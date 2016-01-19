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
