// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract PriceOracleUpgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 private _priceInUSD;
    uint8 private _currencyDecimals;

    function getPriceInUSD() external view returns (uint256) {
        return _priceInUSD;
    }

    function setPriceInUSD(uint256 _valueInWei) external onlyOwner {
        _priceInUSD = _valueInWei;
    }

    function getCurrencyDecimals() external view returns (uint8) {
        return _currencyDecimals;
    }

    function setCurrencyDecimals(uint8 _valueInDecimals) external onlyOwner {
        _currencyDecimals = _valueInDecimals;
    }

    function initialize() public initializer {
        _priceInUSD = 7500000000000000000;
        _currencyDecimals = 18;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
