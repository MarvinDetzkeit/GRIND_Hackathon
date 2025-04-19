import { GameContext } from "../game/lib.js";

const logo = [];
for (let i = 1; i <= 11; i++) {
    logo[i-1] = new Image();
    logo[i-1].src = `game/assets/logo/logo${i}.png`;
    logo[i-1].onload  = () => {};
}

let lFrames = 0;
let framesCount = 0;

export function resetLogo() {
    lFrames = 0;
    framesCount = 0;
}

export function updateLogo() {
    framesCount++;
    let duration;
    switch (lFrames) {
        case 0:
            duration = 30;
            break;
        case 6:
            duration = 30;
            break;
        case 10:
            duration = 90;
            break;
        default:
            duration = 12;
            break;
    }
    if (framesCount > duration) {
        framesCount = 0;
        lFrames = (lFrames + 1) % logo.length;
    }
}

export function renderLogo() {
    const lWitdth = (192 / 32) * GameContext.tileSize;
    const lHeight = (64 / 32) * GameContext.tileSize;
    GameContext.ctx.drawImage(logo[lFrames], (GameContext.canvas.width - lWitdth) / 2, (GameContext.canvas.height / 4) - (lHeight / 2), lWitdth, lHeight);

}