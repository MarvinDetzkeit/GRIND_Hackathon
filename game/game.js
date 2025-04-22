import { GameContext } from './lib.js';
import { Player } from './player.js';
import { Camera } from './player.js';
import { Level } from './level.js';
import { drawBackground, scrollClouds, drawClouds } from './background.js';
import { animateCoin } from './level.js';
import { clearOverlay, showOverlay, showMenuOverlay, clearMenuOverlay, showHelpText } from '../menu/overlay.js';
import { menu } from '../menu/mainMenu.js';
import { updateLogo, renderLogo, resetLogo } from '../menu/logo.js';
import { getData, addPoints } from "../client/data.js";
import { sendToBackend } from '../client/client.js';
import { getWalletAddress } from '../crypto/wallet.js';
import { startMenuMusic, stopMenuMusic, stopGameMusic, startGameMusic } from './sound.js';

// Set screen size
GameContext.canvas.width = window.innerWidth;
GameContext.canvas.height = window.innerHeight;

let player;
let camera;
let level;

function initGame() {
  player = new Player(20 * GameContext.tileSize, 223);
  const playerData = getData();
  player.setSkin(playerData.selectedSkin);
  
  camera = new Camera(player.x, 4 * GameContext.tileSize);
  level = new Level();
  level.load(level.generateSeed(10));
  Input.space = false;
  Input.shift = false;
}

export function endGame() {
  clearOverlay();
  player.coins = Math.floor(player.coins);
  if (player.coins > 0) sendToBackend({walletAddress: getWalletAddress(), newCoins: player.coins}, "/grinded/coins");
  initGame();
  GameContext.gameIsRunning = false;
  resetLogo();
}

export function startGame() {
  if (player.currentChar === "") {
    alert("You need to select a skin.");
    return;
  }
  clearMenuOverlay();
  const playerData = getData();
  player.setSkin(playerData.selectedSkin);
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
    level.load(level.generateSeed(10));
  }
  player.speedX = GameContext.scrollingSpeed;
  camera.speedX = GameContext.scrollingSpeed;
  Input.space = false;
  Input.shift = false;
  GameContext.gameIsRunning = true;
  stopMenuMusic();
  startGameMusic();
}

function update() {
  player.update(level);
  camera.move();
  if ((camera.x - player.x - player.sizeX) > (GameContext.canvas.width / 2)) {
    endGame();
  }
  animateCoin();

  let currentPart = camera.x / (GameContext.tileSize * 20);
  level.setBack(currentPart, player, camera);
}

let notJumped = true;
let notSlided = true;

function handleInputs() {
  if (!GameContext.gameIsRunning) {
    return;
  }
  if (Input.space) {
    notJumped = false;
    player.jump();
    Input.space = false;
  }
  if (Input.shift) {
    notSlided = false;
    player.startStopSliding(level);
    Input.shift = false;
  }
}

function render() {
  drawBackground();
  drawClouds();
  level.render(camera);
  player.render(camera);
}

const Input = {
  shift: false,
  space: false
};

// Listen for keydown and keyup events
window.addEventListener("keydown", (e) => {
  if (e.key === "Shift" || e.key === "ArrowDown") {
    Input.shift = true;
  } else if (e.key === " " || e.key === "ArrowUp") {
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
    scrollClouds();
    if (!GameContext.gameIsRunning) {
      endGame();
      stopGameMusic();
      startMenuMusic();
    }
  }

  //Render
  GameContext.ctx.clearRect(0, 0, GameContext.canvas.width, GameContext.canvas.height);
  render();
  if (GameContext.gameIsRunning) {
    showOverlay(player);
    if (notJumped || notSlided) showHelpText();
  }
  if (!GameContext.gameIsRunning) {
    menu.style.display = "block";
    renderLogo();
    showMenuOverlay();
    if (delta >= timestep) {
      player.setSkin(getData().selectedSkin);
      updateLogo();
      player.updateStandFrames();
    }
  } else {
    menu.style.display = "none";
  }
  const frameEnd = performance.now();

  requestAnimationFrame(gameLoop);
}

