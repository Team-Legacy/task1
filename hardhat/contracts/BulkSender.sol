pragma solidity 0.8.13;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Authorizable.sol";
import "./Nestcoin.sol";

contract BulkSender is Authorizable {
    using SafeMath for uint256;

    event LogTokenBulkSent(address from, uint256 total);
    Nestcoin nestcoin;

    constructor(address tokenAddress) {
        nestcoin = Nestcoin(tokenAddress);
    }

    function AirdropSameValue(address[] calldata _to, uint256 _value)
        external
        onlyAuthorized
    {
        address from = msg.sender;
        require(_to.length <= 200, "exceed max allowed");
        uint256 sendAmount = _to.length.mul(_value);
        nestcoin.mint(
            address(this),
            sendAmount - nestcoin.balanceOf(address(this))
        );
        for (uint8 i = 0; i < _to.length; i++) {
            nestcoin.transfer(_to[i], _value);
        }
        emit LogTokenBulkSent(from, sendAmount);
    }

    function AirdropDifferentValue(
        address[] calldata _to,
        uint256[] calldata _value
    ) external onlyAuthorized {
        address from = msg.sender;
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 200, "exceed max allowed");

        uint256 sendAmount;
        for (uint8 i = 0; i < _to.length; i++) {
            sendAmount.add(_value[i]);
        }
        nestcoin.mint(
            address(this),
            sendAmount - nestcoin.balanceOf(address(this))
        );

        for (uint8 i = 0; i < _to.length; i++) {
            nestcoin.transfer(_to[i], _value[i]);
        }
        emit LogTokenBulkSent(from, sendAmount);
    }
}
