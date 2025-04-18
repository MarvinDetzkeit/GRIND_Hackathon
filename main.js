import { connectWallet, getWalletAddress } from './crypto/wallet.js';
import { gameLoop } from './game/game.js';

async function init() {
  const connected = await connectWallet();
  if (!connected) {
    alert("Wallet connection required to play.");
    return;
  }

  console.log("Connected wallet:", getWalletAddress());
  requestAnimationFrame(gameLoop);
}

init();
