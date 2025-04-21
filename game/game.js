import { GameContext } from './lib.js';
import { Player } from './player.js';
import { Camera } from './player.js';
import { Level } from './level.js';
import { drawBackground } from './background.js';
import { animateCoin } from './level.js';
import { clearOverlay, showOverlay } from '../menu/overlay.js';
import { menu } from '../menu/mainMenu.js';
import { updateLogo, renderLogo, resetLogo } from '../menu/logo.js';
import { getData, addPoints } from "../client/data.js";

// Set screen size
GameContext.canvas.width = window.innerWidth;
GameContext.canvas.height = window.innerHeight;

let player;
let camera;
let level;

function initGame() {
  player = new Player(20 * GameContext.tileSize, 159);
  console.log(getData());
  
  camera = new Camera(player.x, 3 * GameContext.tileSize);
  level = new Level();
  level.load(level.generateSeed(20));
  Input.space = false;
  Input.shift = false;
}

export function endGame() {
  clearOverlay();
  initGame();
  GameContext.gameIsRunning = false;
  resetLogo();
}

export function startGame() {
  const playerData = getData();
  if (playerData.perks.includes("Double Jump")) {
    player.hasDoubleJump = true;
  }
  if (playerData.perks.includes("+2 HP")) {
    player.hp += 2;
  }
  if (playerData.perks.includes("2x Coin Boost")) {
    player.multiplier = 2;
  }
  if (playerData.perks.includes("Unlock Ultra Coins")) {
    level.ultraCoins = true;
    level.load(level.generateSeed(20));
  }
  player.speedX = GameContext.scrollingSpeed;
  camera.speedX = GameContext.scrollingSpeed;
  Input.space = false;
  Input.shift = false;
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
  if (!GameContext.gameIsRunning) {
    return;
  }
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
  }
});

initGame();

let lastTime = 0;
const timestep = 1000.0 / 60.0; // 16.666 ms

export function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  //Logic
  if (delta >= timestep && GameContext.gameIsRunning) {
    lastTime = timestamp;
    handleInputs();
    update();
    if (!GameContext.gameIsRunning) {
      endGame();
    }
  }

  //Render
  GameContext.ctx.clearRect(0, 0, GameContext.canvas.width, GameContext.canvas.height);
  render();
  if (GameContext.gameIsRunning) {
    showOverlay(player);
  }
  if (!GameContext.gameIsRunning) {
    menu.style.display = "block";
    renderLogo();
    updateLogo();
  } else {
    menu.style.display = "none";
  }
  

  requestAnimationFrame(gameLoop);
}

