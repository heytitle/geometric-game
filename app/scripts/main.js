var game = new Game();

function startGame() {
    $('#control-pane').hide();
    $('#start-pane').hide();
    $('#end-pane').show();
    game.init();
}

function replay() {
    $('#control-pane').hide();
    game.replay();
}
