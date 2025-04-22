const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const buffers = {};
let soundsLoaded = false;

async function loadSound(name, path) {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  buffers[name] = audioBuffer;
}

let menuMusicSource = null;
let gameMusicSource = null;

function playLoopingMusic(name) {
  const buffer = buffers[name];
  if (!buffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.3;

  source.connect(gain).connect(audioCtx.destination);
  source.start(0);

  return source;
}

//Menu music
export function startMenuMusic() {
  stopMenuMusic();
  if (!menuMusicSource) {
    menuMusicSource = playLoopingMusic("menuMusic");
  }
}

export function stopMenuMusic() {
  if (menuMusicSource) {
    menuMusicSource.stop();
    menuMusicSource = null;
  }
}

//Gameplay music
export function startGameMusic() {
  stopGameMusic();
  if (!gameMusicSource) {
    gameMusicSource = playLoopingMusic("gameMusic");
  }
}

export function stopGameMusic() {
  if (gameMusicSource) {
    gameMusicSource.stop();
    gameMusicSource = null;
  }
}



function play(name, volume = 1.0) {
    const buffer = buffers[name];
    if (!buffer) return;
  
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
  
    const gain = audioCtx.createGain();
    gain.gain.value = volume;
  
    source.connect(gain).connect(audioCtx.destination);
    source.start(0);
  }

  export function playCoinSound() {
    play("coin", 0.3);
  }

  export function playUltraCoinSound() {
    play("ultracoin", 0.3);
  }
  
  export function playJumpSound() {
    play("jump", 0.3);
  }
  
  export function playFailSound() {
    play("fail");
  }

  export function playHitSound() {
    play("hit");
  }
  
  export async function loadAllSounds() {
    await Promise.all([
      loadSound("coin", "game/assets/fx/coin.mp3"),
      loadSound("jump", "game/assets/fx/jump.mp3"),
      loadSound("fail", "game/assets/fx/fail.mp3"),
      loadSound("hit", "game/assets/fx/hit.mp3"),
      loadSound("ultracoin", "game/assets/fx/ultracoin.mp3"),
      loadSound("menuMusic", "game/assets/music/lobbyLoop.mp3"),
      loadSound("gameMusic", "game/assets/music/ingameloop.mp3")
    ]);
    soundsLoaded = true;
  }

  ["click", "keydown", "mousedown", "touchstart"].forEach((event) => {
    window.addEventListener(event, async () => {
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
    }, { once: true });
  });

  if (!soundsLoaded) {
    await loadAllSounds();
  }
