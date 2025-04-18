import { GameContext } from "./lib.js";

const background = new Image();
background.src = "game/assets/background1.png"; //160 * 448
background.onload = () => {};

export function drawBackground() {
    const w = GameContext.canvas.width;
    for (let i = 0; i <= (w / GameContext.tileSize * 10); i++) {
        GameContext.ctx.drawImage(background, i * GameContext.tileSize * 10, 0, GameContext.tileSize * 10, GameContext.tileSize * 8);
    }
}