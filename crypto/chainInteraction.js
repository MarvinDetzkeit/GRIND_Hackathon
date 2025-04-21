import { ethers } from "https://esm.sh/ethers@5.7.2";
import grindRunAbi from "./abi/GrindRun.js";
import erc20Abi from "./abi/ERC20.js";
import { getSigner } from "./wallet.js";

const contractAddress = "0x55e17cE959444d737a2Fa32A04a6E72DF7BEf0Ae";
const GRIND_TOKEN_ADDRESS = "0x53B0f690E836E248D074360029a0D8dA4982D2Da";

export async function approveTransaction(amount) {
    const signer = getSigner();
  
    const grindToken = new ethers.Contract(GRIND_TOKEN_ADDRESS, erc20Abi, signer);
    const tx = await grindToken.approve(contractAddress, amount);
    await tx.wait();
    console.log("✅ Approved", amount.toString(), "$GRIND for contract");
  }
  
  export async function buyPerk(perkName) {
    const signer = getSigner();
  
    const grindRun = new ethers.Contract(contractAddress, grindRunAbi, signer);
    const tx = await grindRun.buyPerk(perkName);
    await tx.wait();
    console.log("✅ Bought perk:", perkName);
  }

  export async function buySkin(skinName) {
    const signer = getSigner();
  
    const grindRun = new ethers.Contract(contractAddress, grindRunAbi, signer);
    const tx = await grindRun.buySkin(skinName);
    await tx.wait();
    console.log("✅ Bought skin:", skinName);
  }