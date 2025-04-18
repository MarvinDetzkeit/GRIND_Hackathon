import { GameContext } from './lib.js';
import { Player } from './player.js';
import { Camera } from './player.js';
import { Level } from './level.js';
import { drawBackground } from './background.js';
import { animateCoin } from './level.js';
import { loadAllSounds } from "./sound.js";

// Set screen size
GameContext.canvas.width = window.innerWidth;
GameContext.canvas.height = window.innerHeight;

let player;
let camera;
let level;

function initGame() {
  player = new Player(20 * GameContext.tileSize, 159);
  camera = new Camera(player.x, 3 * GameContext.tileSize);
  level = new Level();
  level.load(level.generateSeed(5));
  Input.space = false;
  Input.shift = false;
}

export function endGame() {
  initGame();
  GameContext.gameIsRunning = false;
}

function startGame() {
  player.speedX = GameContext.scrollingSpeed;
  camera.speedX = GameContext.scrollingSpeed;
  GameContext.gameIsRunning = true;
}

function update() {
  player.update(level);
  camera.x += GameContext.scrollingSpeed;
  if ((camera.x - player.x - player.sizeX) > (GameContext.canvas.width / 2)) {
    endGame();
  }
  animateCoin();
}

function handleInputs() {
  if (Input.space) {
    player.jump();
    Input.space = false;
  }
  if (Input.shift) {
    player.startStopSliding(level);
    Input.shift = false;
  }
}

function render() {
  drawBackground();
  level.render(camera);
  player.render(camera);
}

const Input = {
  shift: false,
  space: false
};

// Listen for keydown and keyup events
window.addEventListener("keydown", (e) => {
  if (e.key === "Shift") {
    Input.shift = true;
  } else if (e.key === " ") {
    Input.space = true;
  } else if (e.key === "Enter" && !GameContext.gameIsRunning) {
    startGame();
  }
});

initGame();

let lastTime = 0;
const timestep = 1000.0 / 60.0; // 16.666 ms

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta >= timestep && GameContext.gameIsRunning) {
    lastTime = timestamp;
    handleInputs();
    update();
    if (!GameContext.gameIsRunning) {
      endGame();
    }
  }
  GameContext.ctx.clearRect(0, 0, GameContext.canvas.width, GameContext.canvas.height);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

