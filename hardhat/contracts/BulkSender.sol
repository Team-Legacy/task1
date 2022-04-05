pragma solidity 0.8.13;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Authorizable.sol";

contract BulkSender is Authorizable {
    using SafeMath for uint256;

    event LogTokenBulkSentETH(address from, uint256 total);
    event LogTokenBulkSent(address token, address from, uint256 total);

    function ethSendSameValue(address[] calldata _to, uint256 _value)
        external
        payable
        onlyAuthorized
    {
        uint256 sendAmount = _to.length.mul(_value); //multiple single amount but length of the array
        uint256 remainingValue = msg.value;
        address from = msg.sender;

        require(remainingValue >= sendAmount, "Insufficient balance");
        require(_to.length <= 200, "exceed max allowed"); //Maximum allowed bulk payments are 200

        for (uint8 i = 0; i < _to.length; i++) {
            require(payable(_to[i]).send(_value), "failed to send"); //our Payable function to payout everyone
        }

        emit LogTokenBulkSentETH(from, remainingValue); //Our Emmitter
    }

    function ethSendDifferentValue(
        address[] calldata _to,
        uint256[] calldata _value
    ) external payable onlyAuthorized {
        uint256 sendAmount = _value[0];
        uint256 remainingValue = msg.value;
        address from = msg.sender;

        require(remainingValue >= sendAmount, "Insufficient balance");
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 200, "exceed max allowed");

        for (uint8 i = 0; i < _to.length; i++) {
            require(payable(_to[i]).send(_value[i]));
        }
        emit LogTokenBulkSentETH(from, remainingValue);
    }

    function sendSameValue(
        address _tokenAddress,
        address[] calldata _to,
        uint256 _value
    ) external onlyAuthorized {
        address from = msg.sender;
        require(_to.length <= 200, "exceed max allowed");
        uint256 sendAmount = _to.length.mul(_value);
        IERC20 token = IERC20(_tokenAddress);
        for (uint8 i = 0; i < _to.length; i++) {
            token.transferFrom(from, _to[i], _value);
        }
        emit LogTokenBulkSent(_tokenAddress, from, sendAmount);
    }

    function sendDifferentValue(
        address _tokenAddress,
        address[] calldata _to,
        uint256[] calldata _value
    ) external onlyAuthorized {
        address from = msg.sender;
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 255, "exceed max allowed");
        uint256 sendAmount;
        IERC20 token = IERC20(_tokenAddress);
        for (uint8 i = 0; i < _to.length; i++) {
            token.transferFrom(msg.sender, _to[i], _value[i]);
            sendAmount.add(_value[i]);
        }
        emit LogTokenBulkSent(_tokenAddress, from, sendAmount);
    }
}
