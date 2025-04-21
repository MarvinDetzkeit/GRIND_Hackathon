import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

console.log("🔐 New Wallet Generated:");
console.log("Address:     ", wallet.address);
console.log("Private Key: ", wallet.privateKey);
