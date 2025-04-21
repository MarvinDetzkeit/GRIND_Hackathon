import { connectWallet, getWalletAddress, getSigner } from './crypto/wallet.js';
import { gameLoop } from './game/game.js';
import { sendToBackend } from './client/client.js';
import { setData, getData } from './client/data.js';
import { refreshPerksMenu } from './menu/mainMenu.js';

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
  setData(playerData);
  console.log(playerData);
  refreshPerksMenu();

  if (!playerData.error) {
  requestAnimationFrame(gameLoop);
  }

}

init();
