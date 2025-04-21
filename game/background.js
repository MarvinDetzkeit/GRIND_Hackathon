import { GameContext } from "./lib.js";

const background = new Image();
background.src = "game/assets/background1.png"; //160 * 448
background.onload = () => {};

const cloud = new Image();
cloud.src = "game/assets/cloud.png"; //32 * 32
cloud.onload = () => {};

export function drawBackground() {
    const w = GameContext.canvas.width;
    for (let i = 0; i <= (w / GameContext.tileSize * 10); i++) {
        GameContext.ctx.drawImage(background, i * GameContext.tileSize * 10, 0, GameContext.tileSize * 10, GameContext.tileSize * 8);
    }
}

const clouds = [];

// Initialize clouds spaced out across 4× canvas width
const cloudCount = Math.floor((2 * GameContext.canvas.width) / GameContext.tileSize);
for (let i = 0; i < cloudCount; i++) {
    clouds.push({
        x: i * 4 + Math.random() * GameContext.canvas.width * 5, // spread far apart
        y: Math.random() * 200 + 20
    });
}


export function drawClouds() {
    for (const c of clouds) {
        GameContext.ctx.drawImage(cloud, c.x, c.y, GameContext.tileSize, GameContext.tileSize);
    }
}


export function scrollClouds(baseSpeed = 1) {
    for (const c of clouds) {
        const yFactor = (c.y / GameContext.canvas.height); // 0 (top) to 1 (bottom)
        const adjustedSpeed = baseSpeed * (0.5 + yFactor); // 0.5x to 1x

        c.x -= adjustedSpeed;

        if (c.x < -GameContext.tileSize) {
            c.x = GameContext.canvas.width + Math.random() * 100;
            c.y = Math.random() * 200 + 20;
        }
    }
}

