import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import * as ethers from "ethers";
//import { ethers } from "ethers";


const PLAYER_DATA_DIR = "./playerData";
if (!fs.existsSync(PLAYER_DATA_DIR)) fs.mkdirSync(PLAYER_DATA_DIR);


const app = express();
app.use(cors());                // allow frontend requests
app.use(express.json());        // parse JSON bodies


app.post("/auth/login", (req, res) => {
  console.log("Received login request:", req.body);
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: "Missing walletAddress, signature or message" });
  }

  // Verify that the wallet signed the message
  let recovered;
  try {
    recovered = ethers.verifyMessage(message, signature);
    //recovered = ethers.utils.verifyMessage(message, signature);
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
      points: 0,
      perks: [],
      createdAt: Date.now()
    };
    fs.writeFileSync(filePath, JSON.stringify(newPlayer, null, 2));
  }

  const playerData = JSON.parse(fs.readFileSync(filePath));
  res.json(playerData);
});

app.post("/update/info", (req, res) => {

});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
