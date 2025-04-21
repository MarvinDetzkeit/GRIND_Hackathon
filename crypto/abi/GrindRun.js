const dict = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_grindToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "itemType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "item",
        "type": "string"
      }
    ],
    "name": "itemPurchase",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "perk",
        "type": "string"
      }
    ],
    "name": "buyPerk",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "skin",
        "type": "string"
      }
    ],
    "name": "buySkin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "grindToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "topPlayers",
        "type": "address[]"
      }
    ],
    "name": "rewardTopPlayers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export default dict;