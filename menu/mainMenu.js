import { startGame } from "../game/game.js";
import { getData, setData } from "../client/data.js";
import { sendToBackend } from "../client/client.js";
import { approveTransaction, buyPerk, buySkin } from "../crypto/chainInteraction.js";
import { getWalletAddress } from "../crypto/wallet.js";

export const menu = document.createElement("div");
menu.style.position = "absolute";
menu.style.top = "75%";
menu.style.left = "50%";
menu.style.transform = "translate(-50%, -50%)";
menu.style.background = "rgba(0, 0, 0, 0.8)";
menu.style.padding = "20px";
menu.style.borderRadius = "12px";
menu.style.textAlign = "center";
menu.style.color = "white";
menu.style.zIndex = "20";
document.body.appendChild(menu);

// ========== Main Menu ==========
const mainMenu = document.createElement("div");

const startBtn = document.createElement("button");
startBtn.textContent = "Start Run";
startBtn.onclick = () => {
  startGame();
  switchMenu(mainMenu);
};

const skinsBtn = document.createElement("button");
skinsBtn.textContent = "Skins";
skinsBtn.onclick = () => switchMenu(skinsMenu);

const perksBtn = document.createElement("button");
perksBtn.textContent = "Perks";
perksBtn.onclick = async () => {
  const newPlayerData = await sendToBackend(
    { message: "Getting latest data...", walletAddress: getWalletAddress() },
    "/request/data"
  );
  setData(newPlayerData);
  refreshPerksMenu();
  switchMenu(perksMenu);
};

const leaderboardBtn = document.createElement("button");
leaderboardBtn.textContent = "Leaderboard";
leaderboardBtn.onclick = () => switchMenu(leaderboardMenu);

[ startBtn, skinsBtn, perksBtn, leaderboardBtn ].forEach(btn => {
  btn.style.margin = "10px";
  btn.style.fontSize = "20px";
  btn.style.padding = "10px 20px";
  mainMenu.appendChild(btn);
});

// ========== Skins Menu ==========
const skinsMenu = document.createElement("div");
const backFromSkins = document.createElement("button");
backFromSkins.textContent = "Back";
backFromSkins.onclick = () => switchMenu(mainMenu);
skinsMenu.appendChild(backFromSkins);

// ========== Perks Menu ==========
const perksMenu = document.createElement("div");
perksMenu.style.display = "flex";
perksMenu.style.flexDirection = "column";
perksMenu.style.alignItems = "center";

const perksGrid = document.createElement("div");
perksGrid.style.display = "grid";
perksGrid.style.gridTemplateColumns = "1fr 1fr";
perksGrid.style.gap = "20px";
perksGrid.style.marginBottom = "20px";

const perks = [
  "Double Jump",
  "+2 HP",
  "2x Coin Boost",
  "Unlock Ultra Coins"
];

function createBuyButton(perkName) {
  const buyBtn = document.createElement("button");
  buyBtn.textContent = "777 $GRIND";
  buyBtn.style.padding = "6px 12px";
  buyBtn.style.fontSize = "16px";

  buyBtn.onclick = async () => {
    console.log("Button clicked:", perkName);
    try {
      buyBtn.disabled = true;
      buyBtn.textContent = "Buying...";

      await approveTransaction(777);
      await buyPerk(perkName);

      buyBtn.textContent = "Bought!";
      buyBtn.style.color = "#aaa";

      const newPlayerData = await sendToBackend({ message: "Getting latest data...", walletAddress: getWalletAddress() }, "/request/data");
      setData(newPlayerData);
      refreshPerksMenu();
    } catch (err) {
      console.error(err);
      buyBtn.textContent = "777 $GRIND";
      buyBtn.disabled = true;
      alert("Purchase was not registrated.");
    }
  };

  return buyBtn;
}

export function refreshPerksMenu() {
  perksGrid.innerHTML = "";
  const playerData = getData();

  perks.forEach(perkName => {
    const perkCard = document.createElement("div");
    perkCard.style.background = "#222";
    perkCard.style.padding = "15px";
    perkCard.style.borderRadius = "10px";
    perkCard.style.textAlign = "center";
    perkCard.style.width = "150px";

    const title = document.createElement("div");
    title.textContent = perkName;
    title.style.marginBottom = "10px";
    title.style.fontWeight = "bold";
    perkCard.appendChild(title);

    if (playerData != null && playerData.perks.includes(perkName)) {
      const ownedText = document.createElement("div");
      ownedText.textContent = "Already bought";
      ownedText.style.color = "#aaa";
      perkCard.appendChild(ownedText);
    } else {
      const buyBtn = createBuyButton(perkName);
      perkCard.appendChild(buyBtn);
    }

    perksGrid.appendChild(perkCard);
  });
}

refreshPerksMenu(); // Initial render
perksMenu.appendChild(perksGrid);

const backFromPerks = document.createElement("button");
backFromPerks.textContent = "Back";
backFromPerks.onclick = () => switchMenu(mainMenu);
backFromPerks.style.marginTop = "10px";
perksMenu.appendChild(backFromPerks);

// ========== Leaderboard Menu ==========
const leaderboardMenu = document.createElement("div");
const backFromLeaderboard = document.createElement("button");
backFromLeaderboard.textContent = "Back";
backFromLeaderboard.onclick = () => switchMenu(mainMenu);
leaderboardMenu.appendChild(backFromLeaderboard);

// ========== Menu Switching ==========
function switchMenu(target) {
  [mainMenu, skinsMenu, perksMenu, leaderboardMenu].forEach(menu => {
    menu.style.display = "none";
  });
  target.style.display = "block";
}

menu.appendChild(mainMenu);
menu.appendChild(skinsMenu);
menu.appendChild(perksMenu);
menu.appendChild(leaderboardMenu);

switchMenu(mainMenu); // Default screen
