function SoundFX(){

    Object.keys(SOUNDFX).forEach(function(soundID){
        var src = SOUNDFX[soundID]
        createjs.Sound.registerSound(src,soundID);
    });

    this.play = function(soundID){
        createjs.Sound.play(soundID);
    }
}
