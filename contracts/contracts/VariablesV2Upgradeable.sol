//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VariablesV2Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 private _adminFees;
    address private _presaleContract;
    address private _priceOracleContract;
    address private _swapContract;
    address private _referralContract;
    address private _stakingContract;
    address private _roiContract;
    address private _futureSecureWalletContract;
    address private _tokenContract;
    address private _usdtContract;
    address private _myUSDContract;
    address private _rewardContract;
    address private _uniswapV2Router;
    address private _tokenContractOwner;
    address private _rewardContractOwner;

    address[] private _admins;

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getAdminsList() external view returns (address[] memory) {
        return _admins;
    }

    function isAdmin(address _address) external view returns (bool) {
        address[] memory adminsList = _admins;
        for (uint8 i; i < adminsList.length; ++i) {
            if (_address == adminsList[i]) {
                return true;
            }
        }

        return false;
    }

    function setAdmin(address[] calldata _adminAddress) external onlyOwner {
        for (uint8 i; i < _adminAddress.length; i++) {
            _admins.push(_adminAddress[i]);
        }
    }

    function removeAdmin(
        address[] calldata _addressToRemove
    ) external onlyOwner {
        for (uint16 i; i < _addressToRemove.length; i++) {
            for (uint16 j; j < _admins.length; j++) {
                if (_addressToRemove[i] == _admins[j]) {
                    _admins[j] = _admins[_admins.length - 1];
                    _admins.pop();
                }
            }
        }
    }

    function resetAdmin() external onlyOwner {
        _admins = new address[](0);
    }

    function adminFees() external view returns (uint256) {
        return _adminFees;
    }

    function getPresaleContract() external view returns (address) {
        return _presaleContract;
    }

    function getPriceOracleContract() external view returns (address) {
        return _priceOracleContract;
    }

    function getSwapContract() external view returns (address) {
        return _swapContract;
    }

    function getReferralContract() external view returns (address) {
        return _referralContract;
    }

    function getStakingContract() external view returns (address) {
        return _stakingContract;
    }

    function getROIContract() external view returns (address) {
        return _roiContract;
    }

    function getFutureSecureWalletContract() external view returns (address) {
        return _futureSecureWalletContract;
    }

    function getTokenContract() external view returns (address) {
        return _tokenContract;
    }

    function getUSDTContract() external view returns (address) {
        return _usdtContract;
    }

    function getMyUSDContract() external view returns (address) {
        return _myUSDContract;
    }

    function getRewardContract() external view returns (address) {
        return _rewardContract;
    }

    function getUniswapV2RouterContract() external view returns (address) {
        return _uniswapV2Router;
    }

    function getTokenContractOwner() external view returns (address) {
        return _tokenContractOwner;
    }

    function getRewardContractOwner() external view returns (address) {
        return _rewardContractOwner;
    }

    function setAdminFees(uint256 _valueInWei) external onlyOwner {
        _adminFees = _valueInWei;
    }

    function setContract2(
        address priceOracleContract,
        address swapContract,
        address referralContract,
        address futureSecureWalletContract,
        address roiContract,
        address myUSDContract
    ) external onlyOwner {
        if (priceOracleContract != address(0)) {
            _priceOracleContract = priceOracleContract;
        }

        if (swapContract != address(0)) {
            _swapContract = swapContract;
        }

        if (referralContract != address(0)) {
            _referralContract = referralContract;
        }

        if (futureSecureWalletContract != address(0)) {
            _futureSecureWalletContract = futureSecureWalletContract;
        }

        if (roiContract != address(0)) {
            _roiContract = roiContract;
        }

        if (myUSDContract != address(0)) {
            _myUSDContract = myUSDContract;
        }
    }

    function setContracts(
        address presaleContract,
        address stakingContract,
        address tokenContract,
        address usdtContract,
        address rewardContract,
        address uniswapV2Router,
        address tokenContractOwner,
        address rewardContractOwner
    ) external onlyOwner {
        if (presaleContract != address(0)) {
            _presaleContract = presaleContract;
        }
        if (stakingContract != address(0)) {
            _stakingContract = stakingContract;
        }
        if (tokenContract != address(0)) {
            _tokenContract = tokenContract;
        }
        if (usdtContract != address(0)) {
            _usdtContract = usdtContract;
        }

        if (rewardContract != address(0)) {
            _rewardContract = rewardContract;
        }

        if (uniswapV2Router != address(0)) {
            _uniswapV2Router = uniswapV2Router;
        }

        if (tokenContractOwner != address(0)) {
            _tokenContractOwner = tokenContractOwner;
        }

        if (rewardContractOwner != address(0)) {
            _rewardContractOwner = rewardContractOwner;
        }
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
