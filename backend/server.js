import express from "express";
import cors from "cors";

const app = express();
app.use(cors());                // allow frontend requests
app.use(express.json());        // parse JSON bodies

app.post("/auth/login", (req, res) => {
  console.log("Received login request:", req.body);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
