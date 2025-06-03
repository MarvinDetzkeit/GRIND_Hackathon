import { connectWallet, getWalletAddress, getSigner } from './crypto/wallet.js';
import { gameLoop } from './game/game.js';
import { sendToBackend } from './client/client.js';
import { setData } from './client/data.js';
import { showMenu } from './menu/mainMenu.js';

export let loggedIn = false;

async function init() {


  const playerData = {
    walletAddress: "None",
    nickName: "",
    coins: 0,
    perks: ["Double Jump", "+2 HP", "2x Coin Boost", "Unlock Ultra Coins"],
    skins: ["Hamster", "Bear", "Frog"],
    selectedSkin: "Hamster",
    createdAt: 0
  };

  showMenu();

  setData(playerData); // safe to use getData() from here on
  loggedIn = true;
  requestAnimationFrame(gameLoop);
  
}

init();
