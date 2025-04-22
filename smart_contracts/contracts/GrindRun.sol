// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract GrindRun {
    address public treasury;
    address public owner;
    IERC20 public grindToken;
    mapping(address => uint256) public scores;
    address[] public players;
    uint256 public totalCoins;

    uint256 public constant DECIMALS = 10 ** 18;

    constructor(address _grindToken) {
        grindToken = IERC20(_grindToken);
        treasury = address(this);
        owner = msg.sender;
    }

    event itemPurchase(address indexed buyer, string itemType, string item);
    event rewardedPlayers(uint256 numPlayers, uint256 prizeMoney);

    function buyPerk(string calldata perk) external {
        uint256 price = 777 * DECIMALS;

        bool success = grindToken.transferFrom(msg.sender, treasury, price);

        require(success, "Transaction failed.");

        emit itemPurchase(msg.sender, "perk", perk);
    }

    function buySkin(string calldata skin) external {
        uint256 price = 7777 * DECIMALS;
        bool success = grindToken.transferFrom(msg.sender, treasury, price);

        require(success, "Transaction failed.");

        emit itemPurchase(msg.sender, "skin", skin);
    }

    function addCoinsToScore(address player, uint256 coins) external {
        require(msg.sender == owner && coins > 0, "Only the deployer can add coins and there must be at least one coin to add.");
        if (scores[player] == 0) players.push(player);
        scores[player] += coins;
        totalCoins += coins;
    }

    function rewardPlayers() external {
        require(msg.sender == owner, "Only the deployer can trigger the reward payment.");
        uint256 balance = grindToken.balanceOf(treasury);
        for (uint i = 0; i < players.length; i++) {
            uint256 prize = (balance * scores[players[i]]) / totalCoins;
            bool transaction = grindToken.transfer(players[i], prize);
            require(transaction, "Transaction failed");
            scores[players[i]] = 0;
        }
        delete players;
        totalCoins = 0;

        emit rewardedPlayers(players.length, balance - grindToken.balanceOf(treasury));
    }
}