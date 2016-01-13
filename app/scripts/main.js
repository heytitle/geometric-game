var game = new Game();

function startGame() {
    hideDOM('control-pane');
    hideDOM('start-pane');
    showDOM('end-pane','table');
    game.init();
}

function replay() {
    hideDOM('control-pane');
    game.replay();
}
