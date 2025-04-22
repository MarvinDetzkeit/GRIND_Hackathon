import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { WebSocketProvider, Wallet, Contract, verifyMessage } from "ethers";
import grindRunAbi from "./abi/GrindRun.js";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const contractAddress = "0x30c032Ebe7CC83e65FCB6F9f06F6a9EC4390B234";
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

const provider = new WebSocketProvider(process.env.WSS_URL);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, grindRunAbi, wallet);

const PLAYER_DATA_DIR = "./playerData";
if (!fs.existsSync(PLAYER_DATA_DIR)) fs.mkdirSync(PLAYER_DATA_DIR);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth/login", (req, res) => {
  console.log("Received login request:", req.body);
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: "Missing walletAddress, signature or message" });
  }

  let recovered;
  try {
    recovered = verifyMessage(message, signature);
  } catch (err) {
    return res.status(400).json({ error: "Signature verification failed" });
  }

  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const filePath = path.join(PLAYER_DATA_DIR, `${walletAddress}.json`);

  if (!fs.existsSync(filePath)) {
    const newPlayer = {
      walletAddress,
      nickName: walletAddress,
      coins: 0,
      perks: [],
      skins: [],
      selectedSkin: "",
      createdAt: Date.now()
    };
    fs.writeFileSync(filePath, JSON.stringify(newPlayer, null, 2));
  }

  const playerData = JSON.parse(fs.readFileSync(filePath));
  res.json(playerData);
});

app.post("/request/data", (req, res) => {
  console.log("Received data request:", req.body);
  const walletAddress = req.body.walletAddress;
  const filePath = path.join(PLAYER_DATA_DIR, `${walletAddress}.json`);
  const playerData = JSON.parse(fs.readFileSync(filePath));
  console.log(playerData);
  res.json(playerData);
});

app.post("/update/skin", (req, res) => {
  console.log("Update Skin request: ", req.body);
  const walletAddress = req.body.walletAddress;
  const filePath = path.join(PLAYER_DATA_DIR, `${walletAddress}.json`);
  const playerData = JSON.parse(fs.readFileSync(filePath));
  playerData.selectedSkin = req.body.selectedSkin;
  fs.writeFileSync(filePath, JSON.stringify(playerData, null, 2));
  console.log(`Changed ${walletAddress}'s skin.`)
});

app.post("/grinded/coins", (req, res) => {
  console.log("A player grinded coins: ", req.body);
  const walletAddress = req.body.walletAddress;
  const filePath = path.join(PLAYER_DATA_DIR, `${walletAddress}.json`);
  const playerData = JSON.parse(fs.readFileSync(filePath));
  const numCoins = req.body.newCoins;
  playerData.coins += numCoins;
  fs.writeFileSync(filePath, JSON.stringify(playerData, null, 2));
  if (numCoins > 0) contract.addCoinsToScore(walletAddress, numCoins);
  console.log(`Added coins to ${walletAddress}'.`);
});

contract.on("itemPurchase", (buyer, itemType, item) => {
  console.log(`${buyer} bought ${itemType}: ${item}`);

  const filePath = path.join(PLAYER_DATA_DIR, `${buyer}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn("Buyer not found:", buyer);
    return;
  }

  const playerData = JSON.parse(fs.readFileSync(filePath));

  if (itemType === "perk" && !playerData.perks.includes(item)) {
    playerData.perks.push(item);
  }

  if (itemType === "skin" && !playerData.skins.includes(item)) {
    playerData.skins.push(item);
  }

  fs.writeFileSync(filePath, JSON.stringify(playerData, null, 2));
  console.log(`Updated ${buyer}'s data`);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

// Schedule rewardPlayers on April 25, 2025 at 7PM Berlin Time
cron.schedule('0 17 25 4 *', async () => {
  console.log("Triggering rewardPlayers()");
  try {
    const tx = await contract.rewardPlayers();
    await tx.wait();
    console.log("rewardPlayers executed successfully");
  } catch (err) {
    console.error("Failed to execute rewardPlayers:", err);
  }
});

