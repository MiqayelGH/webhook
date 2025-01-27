require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5002;
const API_KEY =
  "0194a7f4-c9cd-701f-81f4-1e8d5529a30b:76f14f31fde0df2aeb7008cdc8e35b1e95c96e7ad054fc27f3645ca0ce2c7e13";
const WEBHOOK_URL = "";

app.use(bodyParser.json());

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  // Log disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/webhook", async (req, res) => {
  try {
    console.log(req.data, "req");
    console.log(res.data, "res");
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/sendMessage",
      {
        to: "37495998920",
        text: "Bot message",
      },
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Internal Server Error");
  }

  // Log disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Webhook endpoint with WebSocket integration
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  // Emit the webhook data to connected WebSocket clients
  io.emit("webhook_event", req.body);

  res.status(200).send("Webhook processed.");
});

app.get("/getUpdates", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/getUpdates",
      {},
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp.data);
  } catch (error) {
    console.error("Error fetching from YoAI API:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/sendMessage", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/sendMessage",
      {
        to: "37495998920",
        text: "Bot message",
      },
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/setWebhook", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/setWebhook",
      { webhookURL: WEBHOOK_URL },
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp.data);
  } catch (error) {
    console.error("Error setting webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
