const Web3Modal = window.Web3Modal.default;
const ethers = window.ethers;
const WalletConnectProvider = window.WalletConnectProvider.default;


const ABSTRACT_RPC_URL = "https://api.testnet.abs.xyz";
const ABSTRACT_CHAIN_ID = 11124;

const providerOptions = {
  injected: {
    display: {
      name: "Browser Wallet",
      description: "Use MetaMask or another browser extension"
    },
    package: null
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        [ABSTRACT_CHAIN_ID]: ABSTRACT_RPC_URL
      },
      chainId: ABSTRACT_CHAIN_ID
    }
  },
  customAbstract: {
    display: {
      name: "Abstract Wallet",
      description: "Connect to Abstract Blockchain"
    },
    package: null,
    connector: async () => {
      const provider = new ethers.providers.JsonRpcProvider(ABSTRACT_RPC_URL);
      await provider.ready;
      return provider;
    }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions
});

let userWalletAddress = null;
let signer = null;

export async function connectWallet() {
  try {
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    signer = provider.getSigner();
    userWalletAddress = await signer.getAddress();
    return true;
  } catch (e) {
    console.error("Wallet connection failed:", e);
    return false;
  }
}

export function getWalletAddress() {
  return userWalletAddress;
}

export function getSigner() {
  return signer;
}
