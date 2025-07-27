const API_URL = "http://localhost:3000"; 

let currRound = { roundNumber: null };
let crashPoint = null;
let multiplier = 1.0;

const $ = (id) => document.getElementById(id);

function setMsg(m) { $("msg").textContent = m; }
function updateWalletDisplay({ btc=0, eth=0, usdEquivalent=0 }) {
  $("wallet").textContent = 
    `BTC: ${btc.toFixed(6)} | ETH: ${eth.toFixed(6)} | USD: ${usdEquivalent.toFixed(2)}`;
}

async function loadWallet() {
  const playerName = $("playerName").value.trim();
  if (!playerName) return setMsg("Enter name");
  try {
    let r = await fetch(`${API_URL}/wallet/${playerName}`);
    if (!r.ok) throw new Error("Not found");
    let data = await r.json();
    updateWalletDisplay(data);
  } catch {
    updateWalletDisplay({btc:0, eth:0, usdEquivalent:0});
    setMsg("Wallet not found");
  }
}

async function loadHistory() {
  let tbody = $("historyTable").querySelector("tbody");
  tbody.innerHTML = "<tr><td colspan='3'>Loading…</td></tr>";
  try {
    let r = await fetch(`${API_URL}/round/history`);
    let hist = await r.json();
    tbody.innerHTML = "";
    for (let rd of hist.slice(0,5)) {
      let betStr = (rd.bets||[]).map(b =>
        `${b.amountUSD}$ ${b.cryptoType.toUpperCase()} ${b.cashedOut ? `[cashed x${(b.cashoutMultiplier||1).toFixed(2)}]` : ""}`
      ).join("<br>");
      tbody.innerHTML += `<tr>
        <td>${rd.roundNumber}</td>
        <td>x${Number(rd.crashPoint).toFixed(2)}</td>
        <td>${betStr}</td>
        </tr>`;
    }
  } catch { tbody.innerHTML = "<tr><td colspan=3>None</td></tr>"; }
}

async function placeBet() {
  setMsg("Placing bet…");
  let playerName = $("playerName").value.trim();
  let amountUSD = Number($("amountUSD").value);
  let cryptoType = $("cryptoType").value;
  try {
    let r = await fetch(`${API_URL}/bet`, {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, amountUSD, cryptoType })
    });
    let data = await r.json();
    if (!r.ok) throw new Error(data.error || "Bet failed");
    setMsg(`Bet placed: $${amountUSD} (${cryptoType})`);
    loadWallet();
  } catch(e) {
    setMsg(e.message || "Bet failed");
  }
}

async function cashOut() {
  let playerName = $("playerName").value.trim();
  $("cashoutBtn").disabled = true;
  setMsg("Cashing out...");
  try {
    let r = await fetch(`${API_URL}/cashout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName })
    });
    let data = await r.json();
    if (!r.ok) throw new Error(data.error || "Fail");
    setMsg(`Cashed out at x${Number(data.multiplier).toFixed(2)}, payout: ${Number(data.payout).toFixed(6)}`);
    loadWallet();
  } catch(e) {
    setMsg(e.message || "Cashout failed");
  }
}

window.onload = function() {
  $("walletBtn").onclick = () => {
    loadWallet();
    setMsg("");
  }
  $("betBtn").onclick = placeBet;
  $("cashoutBtn").onclick = cashOut;

  loadWallet();
  loadHistory();

  
  // -- SOCKET.IO --
  const socket = io(API_URL);

  socket.on("round_start", (data) => {
    currRound = { roundNumber: data.roundNumber };
    crashPoint = null;
    multiplier = 1.00;
    $("multiplier").textContent = "Multiplier: x1.00";
    $("cashoutBtn").disabled = false;
    $("roundHeading").textContent = `Round #${data.roundNumber}`;
    setMsg("Round started. Place your bets!");
  });
  socket.on("multiplier_update", (data) => {
    multiplier = data.multiplier;
    $("multiplier").textContent = `Multiplier: x${Number(multiplier).toFixed(2)}`;
  });
  socket.on("round_crash", (data) => {
    crashPoint = data.crashPoint;
    setMsg(`Crash! at x${data.crashPoint}`);
    $("cashoutBtn").disabled = true;
    loadWallet();
    loadHistory();
    $("roundHeading").textContent += ` (crashed x${data.crashPoint})`;
    setTimeout(() => setMsg("Next round coming..."), 2000);
  });
}
