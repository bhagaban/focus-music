const fs = require('fs');
const path = require('path');

const player = document.getElementById('player'),
    playBtn = document.getElementById('playBtn'),
    min30Btn = document.getElementById('min30Btn'),
    min60Btn = document.getElementById('min60Btn'),
    progress = document.getElementById('progress');
const doPlay = () => {
    document.getElementById('pauseSVG').classList.remove('hide');
    document.getElementById('playSVG').classList.add('hide');
    player.play();
}
const doPause = () => {
    document.getElementById('pauseSVG').classList.add('hide');
    document.getElementById('playSVG').classList.remove('hide');
    player.pause();
}
        
const musicFolder = path.join(__dirname, 'musics');

const musics = fs.readdirSync(musicFolder);
let inPlayer = [];
let nowPlaying = -1;
let playerTimer = 0;

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const removeActiveBtns = () => {
    min30Btn.classList.remove('active');
    min60Btn.classList.remove('active');    
}
const timeBoxStart = (event) => {
    const ele = event.target;
    inPlayer = getRandom(musics, ele.getAttribute('data-files'));
    console.log(inPlayer);
    nowPlaying = -1;
    playerTimer = 0;
    removeActiveBtns();
    ele.classList.add('active');
    playNextTrack();
}
function playNextTrack(){
    nowPlaying = nowPlaying+1;
    const track = inPlayer[nowPlaying];
    if(track){
        player.src = musicFolder+'/'+track;
        doPlay();
    }else{
        inPlayer = [];
        nowPlaying = -1;
        playerTimer = 0;
        progress.style.width = '0%';
        removeActiveBtns();
        doPause();
    }
}
const playPause = () => (player.paused && inPlayer.length > 0) ? doPlay() : doPause();

setInterval(() => {
    if(!player.paused){
        playerTimer++;
        progress.style.width = ((playerTimer * 100) / (60 * 30 * inPlayer.length))+'%';
    }
}, 1000);

min30Btn.addEventListener('click', timeBoxStart);
min60Btn.addEventListener('click', timeBoxStart);
playBtn.addEventListener('click', playPause);

player.onended = () => playNextTrack();
