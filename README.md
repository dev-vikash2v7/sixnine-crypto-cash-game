# Crash Game Backend (Crypto)

## ⚡ Overview
A backend for a "crash" multiplier crypto game. Players bet in USD (using BTC/ETH conversion), try to cash out before a random crash point—all provably fair, with REST and real-time Socket.IO.

## 🛠️ Stack
- Node.js (Express)
- MongoDB (Mongoose)
- CoinGecko API (crypto prices)
- Socket.IO (real-time)

## 🚦 Installation & Local Start

1. **Clone and enter:**

git clone [<your-url>](https://github.com/dev-vikash2v7/sixnine-crypto-cash-game)
cd sixnine-crypto-cash-game

text

2. **Install:**  
npm install


3. **Start server:**  
npm start


## 🚀 API Endpoints

- `POST /bet`
- `{ playerName, amountUSD, cryptoType: "btc"|"eth" }`
- `POST /cashout`
- `{ playerName }`
- `GET /wallet/:name`
- `GET /round/history`

## 🟢 Socket.IO Events
- `round_start`, `multiplier_update`, `round_crash`, `cashout` (emit)



## 📄 Notes

- **Prices**: Uses CoinGecko, caches 10s.
- **Wallets**: Simple per-player wallet.
