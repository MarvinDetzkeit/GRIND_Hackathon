import { startGame } from "../game/game.js";
import { getData, setData, setSelectedSkin } from "../client/data.js";
import { sendToBackend } from "../client/client.js";
import { approveTransaction, buyPerk, buySkin } from "../crypto/chainInteraction.js";
import { getWalletAddress } from "../crypto/wallet.js";
import { GameContext } from "../game/lib.js";
import { standingH , standingB , standingF} from "../game/player.js";
import { loggedIn } from "../main.js";
import { startMenuMusic } from "../game/sound.js";


const Hamster = standingH[0];
const Bear = standingB[0];
const Frog = standingF[0];

const skins = [
  { name: "Hamster", image: Hamster },
  { name: "Bear", image: Bear },
  { name: "Frog", image: Frog }
];

export const menu = document.createElement("div");
menu.style.position = "absolute";
menu.style.top = "70%";
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
skinsBtn.onclick = async () => {

  let newPlayerData = getData();
  if (newPlayerData.skins.length < 3) {
    newPlayerData = await sendToBackend(
    { message: "Getting latest data...", walletAddress: getWalletAddress() },
    "/request/data"
  );
  setData(newPlayerData);
}
  refreshSkinsMenu();
  switchMenu(skinsMenu);
}

const perksBtn = document.createElement("button");
perksBtn.textContent = "Perks";
perksBtn.onclick = async () => {
  let newPlayerData = getData();
  if (newPlayerData.perks.length < 4) {
  newPlayerData = await sendToBackend(
    { message: "Getting latest data...", walletAddress: getWalletAddress() },
    "/request/data"
  );
  setData(newPlayerData);
  }
  refreshPerksMenu();
  switchMenu(perksMenu);
};

const leaderboardBtn = document.createElement("button");
leaderboardBtn.textContent = "Score";
leaderboardBtn.onclick = async () => {
  switchMenu(scoreMenu);
  //scoreMenu.innerHTML = "";
  await loadScoreMenu();
};

const controlsBtn = document.createElement("button");
controlsBtn.textContent = "Controls";
controlsBtn.onclick = () => switchMenu(controlsMenu);
mainMenu.appendChild(controlsBtn);

const helpBtn = document.createElement("button");
helpBtn.textContent = "Help";
helpBtn.onclick = () => switchMenu(helpMenu);
mainMenu.appendChild(helpBtn);


[ startBtn, skinsBtn, perksBtn, leaderboardBtn, controlsBtn, helpBtn ].forEach(btn => {
  btn.style.margin = "10px";
  btn.style.fontSize = "20px";
  btn.style.padding = "10px 20px";
  mainMenu.appendChild(btn);
});

// ========== Skins Menu ==========
const skinsMenu = document.createElement("div");
skinsMenu.style.display = "flex";
skinsMenu.style.flexDirection = "column";
skinsMenu.style.alignItems = "center";

const skinsGrid = document.createElement("div");
skinsGrid.style.display = "flex";
skinsGrid.style.gap = "30px";
skinsGrid.style.marginBottom = "20px";

function createSkinCard(skin) {
  const card = document.createElement("div");
  card.style.background = "#222";
  card.style.padding = "15px";
  card.style.borderRadius = "10px";
  card.style.textAlign = "center";

  const img = document.createElement("canvas");
  img.width = GameContext.tileSize;
  img.height = GameContext.tileSize * 1.5;
  const ctx = img.getContext("2d");
  ctx.drawImage(
  skin.image,
  0, 0, 32, 48,
  0, 0,
  GameContext.tileSize,
  GameContext.tileSize * 1.5
  );
  card.appendChild(img);

  const label = document.createElement("div");
  label.textContent = skin.name;
  label.style.margin = "10px 0";
  label.style.fontWeight = "bold";
  card.appendChild(label);

  const btn = document.createElement("button");
  btn.style.padding = "6px 12px";
  btn.style.fontSize = "16px";
  card.appendChild(btn);

  const playerData = getData();

  const isOwned = playerData.skins.includes(skin.name);
  const isSelected = playerData.selectedSkin === skin.name;

  if (isOwned) {
    btn.textContent = isSelected ? "Selected" : "Select";
    if (isSelected) btn.style.color = "#aaa";

    btn.onclick = async () => {
      if (isSelected) return;
      btn.textContent = "Selecting...";
      sendToBackend({ selectedSkin: skin.name, walletAddress: getWalletAddress() }, "/update/skin");
      setSelectedSkin(skin.name);
      refreshSkinsMenu();
    };
  } else {
    btn.textContent = "7777 $GRIND";
    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = "Buying...";
      try {
        await approveTransaction(ethers.utils.parseUnits("7777", 18));
        await buySkin(skin.name);
        sendToBackend({ itemType: "skin", item: skin.name, walletAddress: getWalletAddress() }, "/bought/item");
        let newPlayerData = getData();
        if (!newPlayerData.skins.includes(skin.name)) newPlayerData.skins.push(skin.name);
        setData(newPlayerData);
        refreshSkinsMenu();
      } catch (err) {
        console.error(err);
        alert("Purchase failed.");
        btn.disabled = false;
        btn.textContent = "7777 $GRIND";
      }
    };
  }

  return card;
}

function refreshSkinsMenu() {
  skinsGrid.innerHTML = "";
  skins.forEach(skin => {
    skinsGrid.appendChild(createSkinCard(skin));
  });
}

refreshSkinsMenu();
skinsMenu.appendChild(skinsGrid);

const backFromSkins = document.createElement("button");
backFromSkins.textContent = "Back";
backFromSkins.onclick = () => switchMenu(mainMenu);
backFromSkins.style.marginTop = "10px";
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

      await approveTransaction(ethers.utils.parseUnits("777", 18));
      await buyPerk(perkName);

      buyBtn.textContent = "Bought!";
      buyBtn.style.color = "#aaa";

      sendToBackend({ itemType: "perk", item: perkName, walletAddress: getWalletAddress() }, "/bought/item");
      let newPlayerData = getData();
      if (!newPlayerData.perks.includes(perkName)) newPlayerData.perks.push(perkName);
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

// ========== Score Menu ==========
const scoreMenu = document.createElement("div");
scoreMenu.style.color = "white";
scoreMenu.style.fontFamily = "monospace";
scoreMenu.style.padding = "20px";

const title = document.createElement("h2");
title.textContent = "Your Score";
scoreMenu.appendChild(title);

const info = document.createElement("div");
info.textContent = "Loading...";
scoreMenu.appendChild(info);

const backFromScore = document.createElement("button");
backFromScore.textContent = "Back";
backFromScore.onclick = () => switchMenu(mainMenu); // Assumes mainMenu is in scope
scoreMenu.appendChild(backFromScore);

// Function to fetch score data from server
export async function loadScoreMenu() {
    const data = getData();
    try {
        const response = await sendToBackend({walletAddress: data.walletAddress}, "/score/info");

        const {
            treasuryBalance,
            totalCoins,
            playerCoins,
            percent,
            grindReward
        } = response;

        info.innerHTML = `
            <p>Total Treasury Balance: ${treasuryBalance} $GRIND</p>
            <p>Total Coins (all players): ${totalCoins}</p>
            <p>Your Coins: ${playerCoins}</p>
            <p>Your Share of all Coins: ${percent.toFixed(2)}%</p>
            <p>Expected Reward (Based on your current share of coins): ${grindReward.toFixed(2)} $GRIND</p>
        `;
    } catch (err) {
        info.textContent = "Failed to load score data.";
        console.error(err);
    }
}

// ========== Start Game Menu ==========
const startGameMenu = document.createElement("div");

const startGameBtn = document.createElement("button");
startGameBtn.textContent = "Enter Game";
startGameBtn.onclick = () => {
  if (loggedIn) {
  switchMenu(mainMenu);
  startGameMenu.remove();
  startMenuMusic();
  if (getData().selectedSkin === "") alert("Buy and select a skin to play the game.");
  }
};

startGameBtn.style.fontSize = "24px";
startGameBtn.style.padding = "15px 30px";
startGameBtn.style.margin = "20px";

startGameMenu.appendChild(startGameBtn);

// ========== Controls Menu ==========
const controlsMenu = document.createElement("div");
controlsMenu.style.color = "white";
controlsMenu.style.fontFamily = "monospace";
controlsMenu.style.padding = "20px";
controlsMenu.style.maxWidth = "500px";
controlsMenu.style.margin = "auto";
controlsMenu.style.textAlign = "left";

const controlsTitle = document.createElement("h2");
controlsTitle.textContent = "Game Controls";
controlsMenu.appendChild(controlsTitle);

const controlsInfo = document.createElement("div");
controlsInfo.innerHTML = `
  <p><b>Jump:</b> Press SPACE or ARROW-UP</p>
  <p><b>Slide:</b> Press SHIFT or ARROW-DOWN - Don't hold the button! You stand up after half a second, or after pressing again. 
  After standing up, you can't slide for as long, as you were sliding.</p>
`;
controlsMenu.appendChild(controlsInfo);

const backFromControls = document.createElement("button");
backFromControls.textContent = "Back";
backFromControls.onclick = () => switchMenu(mainMenu);
backFromControls.style.marginTop = "20px";
controlsMenu.appendChild(backFromControls);

// ========== Help Menu ==========
const helpMenu = document.createElement("div");
helpMenu.style.color = "white";
helpMenu.style.fontFamily = "monospace";
helpMenu.style.padding = "20px";
helpMenu.style.maxWidth = "500px";
helpMenu.style.margin = "auto";
helpMenu.style.textAlign = "left";

const HelpTitle = document.createElement("h2");
HelpTitle.textContent = "Game Controls";
helpMenu.appendChild(HelpTitle);

const helpInfo = document.createElement("div");
helpInfo.innerHTML = `
  <p><b>How to Play?:</b> Buy and select a skin from the skin shop, then you can start a run.</p>
  <p><b>The Game feels hard?:</b> Buy perks from the perk shop to make your life easier and earn more coins.</p>
  <p><b>Where do the $GRIND tokens go?:</b> The tokens go into a treasury. At the end of a season, it gets distributed to all players.</p>
  <p><b>How does the reward distribution work?:</b> Every player gets a share of the treasury. The amount depends on how many coins
  the player collected, relative to how many coins were collected by all players combined. 
  For example, a player who collected 10% of all the coins collected by all players, gets 10% of the treasury.</p>
  <p><b>Who ensures fair distribution?:</b> A smart contract manages player's coins and distribution. 
  It is impossible to access the treasury's tokens as the wallet that holds the tokens is the contract itself.</p>
  
`;
helpMenu.appendChild(helpInfo);

const backFromHelp = document.createElement("button");
backFromHelp.textContent = "Back";
backFromHelp.onclick = () => switchMenu(mainMenu);
backFromHelp.style.marginTop = "20px";
helpMenu.appendChild(backFromHelp);


// ========== Menu Switching ==========
function switchMenu(target) {
  [mainMenu, skinsMenu, perksMenu, scoreMenu, controlsMenu, helpMenu].forEach(menu => {
    menu.style.display = "none";
  });
  target.style.display = "block";
}


menu.appendChild(startGameMenu);
menu.appendChild(mainMenu);
menu.appendChild(skinsMenu);
menu.appendChild(perksMenu);
menu.appendChild(scoreMenu);
menu.appendChild(controlsMenu);
menu.appendChild(helpMenu);

switchMenu(startGameMenu);

export function hideMenu() {
  menu.style.display = "none";
}

export function showMenu() {
  menu.style.display = "block";
}

hideMenu();
