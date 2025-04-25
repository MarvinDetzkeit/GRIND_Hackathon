import { connectWallet, getWalletAddress, getSigner } from './crypto/wallet.js';
import { gameLoop } from './game/game.js';
import { sendToBackend } from './client/client.js';
import { setData } from './client/data.js';
import { showMenu } from './menu/mainMenu.js';

export let loggedIn = false;

async function init() {
  const connected = await connectWallet();
  if (!connected) {
    alert("Wallet connection required to play.");
    return;
  }

  const walletAddress = getWalletAddress();
  const signer = getSigner();
  const message = "Log in to Grind Run";
  const signature = await signer.signMessage(message);


  const playerData = await sendToBackend(
    { walletAddress, signature, message },
    "/auth/login"
  );

  showMenu();

  setData(playerData); // safe to use getData() from here on
  console.log(playerData);

  if (playerData.createdAt > 0) {
    loggedIn = true;
    requestAnimationFrame(gameLoop);
  }
}

init();
