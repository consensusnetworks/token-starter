//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This contract is a simple wrapper around the ERC20 contract.
// You can change the contract name where it says "Token".
contract Token is ERC20 {
    constructor(string memory name, string memory symbol, uint256 decimals, uint256 supply) ERC20(name, symbol) {
        _mint(msg.sender, supply * 10 ** decimals);
    }
}