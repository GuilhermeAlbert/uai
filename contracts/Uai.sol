// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract UaiCoin is ERC20Burnable {
    constructor(uint256 initialSupply) ERC20("UaiCoin", "UAI") {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}