import { Player } from "../game/player.js";

const coinCount = document.createElement("div");
coinCount.style.position = "absolute";
coinCount.style.top = "10px";
coinCount.style.left = "10px";
coinCount.style.color = "white";
coinCount.style.fontFamily = "monospace";
coinCount.style.fontSize = "18px";
coinCount.style.zIndex = "10";
coinCount.textContent = "Coins: 0";

const hpCount = document.createElement("div");
hpCount.style.position = "absolute";
hpCount.style.top = "10px";
hpCount.style.right = "10px";
hpCount.style.color = "white";
hpCount.style.fontFamily = "monospace";
hpCount.style.fontSize = "18px";
hpCount.style.zIndex = "10";
hpCount.textContent = "Coins: 0";

export function showOverlay(player) {
    coinCount.textContent = `Coins: ${player.coins}`;
    hpCount.textContent = `HP: ${player.hp}`;
    document.body.appendChild(coinCount);
    document.body.appendChild(hpCount);
}

export function clearOverlay() {
    coinCount.textContent = "";
    hpCount.textContent = "";
    document.body.appendChild(coinCount);
    document.body.appendChild(hpCount);
}