//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint256);
}

contract VariablesUpgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _presaleContract;
    address private _referralContract;
    address private _stakingContract;
    address private _tokenContract;
    address private _usdtContract;
    address private _rewardContract;

    uint256 private _tokenPriceInUSD;

    address private _tokenContractOwner;
    address private _rewardContractOwner;
    uint256 private _userBalanceLimitPerc;

    struct Account {
        uint256 claimableBalance;
        uint256 initalBalance;
        uint256 limit;
    }

    mapping(address => Account) private accounts;

    modifier onlyAdmins() {
        address _msgSender = msg.sender;
        require(
            _msgSender == owner() ||
                _msgSender == _referralContract ||
                _msgSender == _stakingContract,
            "Only Admins can call this function"
        );
        _;
    }

    function initialize() public initializer {
        _presaleContract = 0x0c750b915ef0112B204f0f7E6812be292b9936A2;
        _referralContract = 0x7144552bC1DEB1fa1817375c4E66879cAAD65F05;
        _stakingContract = 0x0c750b915ef0112B204f0f7E6812be292b9936A2;

        _usdtContract = 0x0c750b915ef0112B204f0f7E6812be292b9936A2;
        _rewardContract = 0x0c750b915ef0112B204f0f7E6812be292b9936A2;

        _tokenPriceInUSD = 16000000000000000000;
        _userBalanceLimitPerc = 300;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function getContracts()
        external
        view
        returns (
            address presaleContract,
            address referralContract,
            address stakingContract,
            address tokenContract,
            address usdtContract,
            address rewardContract
        )
    {
        presaleContract = _presaleContract;
        referralContract = _referralContract;
        stakingContract = _stakingContract;
        tokenContract = _tokenContract;
        usdtContract = _usdtContract;
        rewardContract = _rewardContract;
    }

    function getPresaleContract() external view returns (address) {
        return _presaleContract;
    }

    function getReferralContract() external view returns (address) {
        return _referralContract;
    }

    function getStakingContract() external view returns (address) {
        return _stakingContract;
    }

    function getTokenContract() external view returns (address) {
        return _tokenContract;
    }

    function tokenContractInfo()
        external
        view
        returns (
            address tokenAddress,
            string memory name,
            string memory symbol,
            uint256 decimals
        )
    {
        tokenAddress = _tokenContract;
        name = IERC20_EXTENDED(_tokenContract).name();
        symbol = IERC20_EXTENDED(_tokenContract).symbol();
        decimals = IERC20_EXTENDED(_tokenContract).decimals();
    }

    function getTokenPriceInUSD() external view returns (uint256) {
        return _tokenPriceInUSD;
    }

    function setTokenPriceInUSD(uint256 _priceInUSDWei) external onlyAdmins {
        _tokenPriceInUSD = _priceInUSDWei;
    }

    function getUSDTContract() external view returns (address) {
        return _usdtContract;
    }

    function getRewardContract() external view returns (address) {
        return _rewardContract;
    }

    function tokenContractOwner() external view returns (address) {
        return _tokenContractOwner;
    }

    function rewardContractOwner() external view returns (address) {
        return _rewardContractOwner;
    }

    function setTokenContract(address _tokenAddress) external onlyOwner {
        _tokenContract = _tokenAddress;
    }

    function setUSDTContract(address _usdtAddress) external onlyOwner {
        _usdtContract = _usdtAddress;
    }

    function setRewardContract(address _rewardAddress) external onlyOwner {
        _rewardContract = _rewardAddress;
    }

    function setPresaleContract(address _presaleAddress) external onlyOwner {
        _presaleContract = _presaleAddress;
    }

    function setReferralContract(address _referralAddress) external onlyOwner {
        _referralContract = _referralAddress;
    }

    function setSatkingContract(address _stakingAddress) external onlyOwner {
        _stakingContract = _stakingAddress;
    }

    function setUserInitialBalance(
        address _userAddress,
        uint256 _valueInWei
    ) external onlyAdmins {
        accounts[_userAddress].initalBalance += _valueInWei;
        accounts[_userAddress].limit +=
            (_valueInWei * _userBalanceLimitPerc) /
            100;
    }

    function isUserBalanceLimitReached(
        address _userAddress
    ) external view returns (bool) {
        if (
            accounts[_userAddress].initalBalance >= accounts[_userAddress].limit
        ) {
            return true;
        }

        return false;
    }

    function getUserBalance(
        address _userAddress
    ) external view returns (uint256) {
        if (
            accounts[_userAddress].initalBalance >= accounts[_userAddress].limit
        ) {
            return accounts[_userAddress].limit;
        }

        return accounts[_userAddress].claimableBalance;
    }

    function increaseUserBalance(
        address _userAddress,
        uint256 _value
    ) external onlyAdmins {
        if (
            accounts[_userAddress].initalBalance + _value <
            accounts[_userAddress].limit
        ) {
            accounts[_userAddress].claimableBalance += _value;
        } else {
            accounts[_userAddress].claimableBalance = accounts[_userAddress]
                .limit;
        }
    }

    function decreaseUserBalance(
        address _userAddress,
        uint256 _value
    ) external onlyAdmins {
        accounts[_userAddress].claimableBalance -= _value;
    }

    function setUserBalance(
        address _userAddress,
        uint256 _value
    ) external onlyAdmins {
        accounts[_userAddress].claimableBalance = _value;
    }

    function getUserBalanceLimit(
        address _userAddress
    ) external view returns (uint256) {
        return accounts[_userAddress].limit;
    }

    function setUserBalanceLimit(
        address _userAddress,
        uint256 _valueInWei
    ) external onlyOwner {
        accounts[_userAddress].limit = _valueInWei;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
