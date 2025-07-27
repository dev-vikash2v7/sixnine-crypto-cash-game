# Crash Game Backend (Crypto)

## ⚡ Overview
A backend for a "crash" multiplier crypto game. Players bet in USD (using BTC/ETH conversion), try to cash out before a random crash point—all provably fair, with REST and real-time Socket.IO.

## 🛠️ Stack
- Node.js (Express)
- MongoDB (Mongoose)
- CoinGecko API (crypto prices)
- Socket.IO (real-time)
- No actual blockchain, just simulated wallets

## 🚦 Installation & Local Start

1. **Clone and enter:**

git clone <your-url>
cd crash-game-backend

text

2. **Install:**  
npm install

text

3. **Configure** `.env` as in sample above.

4. **Seed sample players:**  
npm run seed

text

5. **Start server:**  
npm run dev

text

## 🚀 API Endpoints

- `POST /bet`
- `{ playerName, amountUSD, cryptoType: "btc"|"eth" }`
- `POST /cashout`
- `{ playerName }`
- `GET /wallet/:name`
- `GET /round/history`

## 🟢 Socket.IO Events
- `round_start`, `multiplier_update`, `round_crash`, `cashout` (emit)

See comments in code for logic.

## 🧮 Provably Fair
Server seed and hashes for each round are logged + returned; verify crash point using provided hash-to-multiplier function.

---

## 📄 Notes

- **Prices**: Uses CoinGecko, caches 10s.
- **Wallets**: Simple per-player wallet.
- **Crash Logic**: Random, deterministic via `serverSeed`.
- **No real money.** Educational/demo project!

---

**Happy hacking!**
4. (OPTIONAL) Simple HTML Client for Testing WebSocket
You can test with REST tools (Postman/cURL). For sockets, create a public/test.html:

xml
<!DOCTYPE html>
<html>
<head><title>Crash Game Socket Test</title></head>
<body>
  <h3>See console for events</h3>
  <button onclick="sendCashout()">Send Cashout</button>
  <script src="https://cdn.socket.io/4.7.6/socket.io.min.js"></script>
  <script>
    const socket = io("http://localhost:3000");
    socket.on('round_start', data => console.log('Round start', data));
    socket.on('multiplier_update', data => console.log('Multiplier', data));
    socket.on('round_crash', data => console.log('Crash', data));
    function sendCashout() {
      socket.emit('cashout', { playerName: 'Alice' });
    }
  </script>
</body>
</html>
✅ HOW TO DOWNLOAD
Copy all code above into matching folders/files.

In terminal, at root, run the steps in the README.

Once you have the folder set up, zip it with:

bash
zip -r crash-game-backend.zip .
Or, push to your own GitHub.