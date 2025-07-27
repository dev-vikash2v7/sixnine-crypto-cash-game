import axios from "axios";

let lastPrices = null;
let lastFetch = 0;

export async function getPrices() {
  if (Date.now() - lastFetch < 10000 && lastPrices) return lastPrices;
  try {
    const resp = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
    lastPrices = {
      btc: resp.data.bitcoin.usd,
      eth: resp.data.ethereum.usd
    };
    lastFetch = Date.now();
    return lastPrices;
  } catch (e) {
    return lastPrices || { btc: 60000, eth: 3500 };
  }
}
