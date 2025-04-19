import { connectWallet, getWalletAddress, getSigner } from './crypto/wallet.js';
import { gameLoop } from './game/game.js';
import { sendToBackend } from './client/client.js';
import { setData } from './client/data.js';

async function init() {
  const connected = await connectWallet();
  if (!connected) {
    alert("Wallet connection required to play.");
    return;
  }

  const walletAddress = getWalletAddress();
  const signer = getSigner();
  const message = "Login to GRIND game";
  const signature = await signer.signMessage(message);

  const playerData = await sendToBackend(
    { walletAddress, signature, message },
    "/auth/login"
  );
  console.log(playerData);

  if (!playerData.error) {
  setData(playerData);
  requestAnimationFrame(gameLoop);
  }

}

init();
