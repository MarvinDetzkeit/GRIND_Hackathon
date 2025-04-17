async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Verbunden mit:", accounts[0]);
        alert("Wallet verbunden: " + accounts[0]);
      } catch (err) {
        console.error("Verbindung abgelehnt", err);
      }
    } else {
      alert("MetaMask nicht installiert!");
    }
  }
  