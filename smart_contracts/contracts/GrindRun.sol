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

    constructor(address _grindToken) {
        grindToken = IERC20(_grindToken);
        treasury = address(this);
        owner = msg.sender;
    }

    event itemPurchase(address indexed buyer, string itemType, string item);

    function buyPerk(string calldata perk) external {
        uint256 price = 777;

        bool success = grindToken.transferFrom(msg.sender, treasury, price);

        require(success, "Transfer failed :(");

        emit itemPurchase(msg.sender, "perk", perk);
    }

    function buySkin(string calldata skin) external {
        uint256 price = 7777;
        bool success = grindToken.transferFrom(msg.sender, treasury, price);

        require(success, "Transfer failed :(");

        emit itemPurchase(msg.sender, "skin", skin);
    }

    function rewardTopPlayers(address[] calldata topPlayers) external {
        require(msg.sender == owner, "Only the owner can do that.");
        uint256 cut = grindToken.balanceOf(treasury) / 5;
        for (uint256 i = 0; i < topPlayers.length && i < 5; i++) {
            require(grindToken.transfer(topPlayers[i], cut), "Transaction failed!");
        }
    }

}
