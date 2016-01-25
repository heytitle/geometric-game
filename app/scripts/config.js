var IDCANVAS  = '#game-board';

var BASE_SCORE = 5;
var SPECIAL_ITEMS_TRADE = 1;
var DIAMOND_MULTIPIER = 2;

var DRAG_OPACITY = 0.5;

var SCALING = 30;

var STATE = {
    IDLE: 0,
    SELECTING: 1,
    WAITING: 2,
    TIMEUP: 3,
    USING_SPECIAL_ITEM: 4
};

var DURATION = {
    selecting: 1000,
    waiting: 1000,
    game: 60
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
        speedX: 2,
        speedY: 2,
    },
    cat: {
        speedX: 3,
        speedY: 3,
    }
}

var SOUNDFX = {
    'addObject': 'https://www.freesound.org/data/previews/21/21389_36084-lq.mp3',
    'awesome' : 'https://www.freesound.org/data/previews/187/187925_3140412-lq.mp3',
    'oh-no': 'http://freesound.org/data/previews/131/131409_2337290-lq.mp3',
    'error': 'http://freesound.org/data/previews/188/188013_2906575-lq.mp3'
}
