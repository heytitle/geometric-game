var IDCANVAS  = '#game-board';

var STATE = {
    IDLE: 0,
    SELECTING: 1,
    WAITING: 2,
    TIMEUP: 3
};

var DURATION = {
    selecting: 1000,
    waiting: 1000,
    game: 180
}

var LEVEL_SETTING = {
    1: {
        cat: 2,
        dog: 2
    },
    2: {
        cat: 1,
        dog: 1
    }
}

var MOVEMENT_CHARACTER = {
    dog: {
        speedX: 5,
        speedY: 5,
    },
    cat: {
        speedX: 6,
        speedY: 6,
    }
}
