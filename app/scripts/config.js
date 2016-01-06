var IDCANVAS  = '#game-board';

var BASE_SCORE = 10;

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
        objects: {
            cat: 2,
            dog: 2
        }
    },
    2: {
        objects: {
            cat: 2,
            dog: 2
        }
    }
}
var MAX_LEVEL = Object.keys(LEVEL_SETTING).splice(-1,1);

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

var SOUNDFX = {
    'addObject': 'https://www.freesound.org/data/previews/21/21389_36084-lq.mp3',
    'awesome' : 'https://www.freesound.org/data/previews/187/187925_3140412-lq.mp3',
    'oh-no': 'http://freesound.org/data/previews/131/131409_2337290-lq.mp3'
}
