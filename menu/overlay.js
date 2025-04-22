import { Player } from "../game/player.js";
import { GameContext } from "../game/lib.js";
import { getData } from "../client/data.js";

const heart = new Image();
heart.src = `game/assets/heart.png`;
heart.onload  = () => {};

const coinCount = document.createElement("div");
coinCount.style.position = "absolute";
coinCount.style.top = "10px";
coinCount.style.left = "10px";
coinCount.style.color = "grey";
coinCount.style.fontFamily = "monospace";
coinCount.style.fontSize = "18px";
coinCount.style.zIndex = "10";
coinCount.textContent = "Coins: 0";

const hpContainer = document.createElement("div");
hpContainer.style.position = "absolute";
hpContainer.style.top = "10px";
hpContainer.style.right = "10px";
hpContainer.style.display = "flex";
hpContainer.style.gap = "4px";
hpContainer.style.zIndex = "10";

const bonusText = document.createElement("div");
bonusText.style.position = "absolute";
bonusText.style.top = "10px";
bonusText.style.left = "50%";
bonusText.style.transform = "translateX(-50%)";
bonusText.style.color = "grey";
bonusText.style.fontFamily = "monospace";
bonusText.style.fontSize = "18px";
bonusText.style.zIndex = "10";

export function showOverlay(player) {
    coinCount.textContent = `Coins: ${player.coins}`;

    hpContainer.innerHTML = "";
    for (let i = 0; i < player.hp; i++) {
        const img = document.createElement("img");
        img.src = heart.src;
        img.style.width = `${GameContext.tileSize / 2}px`;
        img.style.height = `${GameContext.tileSize / 2}px`;
        hpContainer.appendChild(img);
    }

    bonusText.textContent = `Coin Bonus: +${100 * (player.multiplier - 1) + (player.multiplier * ((player.coinAmountMultiplier - 1) * 100))}%`;

    document.body.appendChild(coinCount);
    document.body.appendChild(hpContainer);
    document.body.appendChild(bonusText);
}

export function clearOverlay() {
    coinCount.textContent = "";
    hpContainer.innerHTML = "";
    bonusText.textContent = "";

    document.body.appendChild(coinCount);
    document.body.appendChild(hpContainer);
    document.body.appendChild(bonusText);
}

// --- NEW MENU OVERLAY ---

const seasonText = document.createElement("div");
seasonText.style.position = "absolute";
seasonText.style.top = "10px";
seasonText.style.left = "10px";
seasonText.style.color = "grey";
seasonText.style.fontFamily = "monospace";
seasonText.style.fontSize = "14px";
seasonText.style.zIndex = "10";
seasonText.textContent = "Season ends April 25th, 1PM EST";

const loggedInText = document.createElement("div");
loggedInText.style.position = "absolute";
loggedInText.style.top = "10px";
loggedInText.style.right = "10px";
loggedInText.style.color = "grey";
loggedInText.style.fontFamily = "monospace";
loggedInText.style.fontSize = "14px";
loggedInText.style.zIndex = "10";

export function showMenuOverlay() {
    loggedInText.textContent = `Logged in as ${getData().walletAddress}`;

    document.body.appendChild(seasonText);
    document.body.appendChild(loggedInText);
}

export function clearMenuOverlay() {
    seasonText.remove();
    loggedInText.remove();
}
