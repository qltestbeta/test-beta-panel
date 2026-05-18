// js/app.js

const CHAIN_ID = "0x13882";

// ✅ КАНОНИЧЕН MockUSDT
const MOCK_USDT = "0xB491F91d95078B0279639bc68e48A4e2bF696270";

// ✅ КАНОНИЧЕН Lottery
const LOTTERY = "0x378D6B8CD73f0AF6ec9a5208e4ba16e00A3AF55a";

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const weeklyBtn = document.querySelector('[data-action="weekly"]');
  const monthlyBtn = document.querySelector('[data-action="monthly"]');
  const historyBtn = document.querySelector('[data-action="history"]');

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return null;
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID }]
    });

    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const account = await signer.getAddress();

    return { provider, signer, account };
  }

  async function approveUSDT() {
    try {
      const connected = await connect();
      if (!connected) return;

      const { signer, account } = connected;

      const usdt = new ethers.Contract(MOCK_USDT, ERC20_ABI, signer);

      const tx = await usdt.approve(LOTTERY, ethers.constants.MaxUint256);

      alert("Approve sent from:\n" + account + "\n\nTX:\n" + tx.hash);

      await tx.wait();

      alert("Approve CONFIRMED for:\n" + account);
    } catch (err) {
      alert("ERR:\n" + (err?.message || err));
    }
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
  }

  if (weeklyBtn) weeklyBtn.addEventListener("click", approveUSDT);
  if (monthlyBtn) monthlyBtn.addEventListener("click", approveUSDT);

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      alert("History still DEMO");
    });
  }
});