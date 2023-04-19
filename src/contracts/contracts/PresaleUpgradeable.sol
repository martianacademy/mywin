//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IStaking {
    function stakeByAdmin(
        address _userAddress,
        uint256 _value,
        uint256 _duration
    ) external returns (bool);
}

interface IReferral {
    function hasReferrer(address _address) external view returns (bool);

    function addReferrerAdmin(
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payReferralETHAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payReferralUSDAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function getLevelDecimals() external view returns (uint256);

    function getLevelRates()
        external
        view
        returns (
            uint256[] memory presale,
            uint256 totalRatePresale,
            uint256[] memory staking,
            uint256 totalRateStaking
        );

    function getUserReferrerAddress(
        address _address
    ) external view returns (address referrer);
}

interface IVariables {
    function getPresaleContract() external view returns (address);

    function getReferralContract() external view returns (address);

    function getStakingContract() external view returns (address);

    function getTokenPriceInUSD() external view returns (uint256);

    function getUSDTContract() external view returns (address);

    function getRewardContract() external view returns (address);

    function rewardContractOwner() external view returns (address);

    function isUserBalanceLimitReached(
        address _userAddress
    ) external view returns (bool);

    function getUserBalance(
        address _userAddress
    ) external view returns (uint256);

    function increaseUserBalance(address _userAddress, uint256 _value) external;

    function decreaseUserBalance(address _userAddress, uint256 _value) external;

    function setUserBalance(address _userAddress, uint256 _value) external;
}

contract PresaleUpgradeable is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    address private _variablesContract;

    address private _tokenSeller;
    address private _rewardOwner;

    address private _tokenContract;
    address private _stakingContract;
    address private _referralContract;
    address private _usdtContract;
    address private _rewardTokenContract;

    uint256 private _priceInUSD;
    uint256 private _rewardPerUSD;
    uint256 private _minContributionUSD;

    uint256 private _totalTokenSold;
    uint256 private _totalETHRaised;
    uint256 private _totalUSDRaised;

    bool private _isBuyNStake;
    bool private _isPayReferral;
    bool private _isPayRewardTokens;

    receive() external payable {}

    event TokenPurchased(
        address indexed from,
        uint256 indexed tokenValue,
        uint256 indexed ethValue,
        string currency
    );

    event RewardTokenDistributed(
        address indexed to,
        uint256 indexed tokenValue,
        address indexed rewardTokenContract
    );

    function initialize() external initializer {
        _tokenSeller = 0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447;
        _rewardOwner = 0xf91e1eD00f015c6Be3FBc6b0d84fBaEF005ec5B5;

        _isPayReferral = true;
        _isBuyNStake = false;
        _isPayRewardTokens = true;

        _minContributionUSD = 20000000000000000000;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function pauseAdmin() external onlyOwner {
        _pause();
    }

    function unpauseAdmin() external onlyOwner {
        _unpause();
    }

    function transferETH(address _address, uint256 _value) external onlyOwner {
        payable(_address).transfer(_value);
    }

    function withdrawETH() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getMinContribution() external view returns (uint256) {
        return _minContributionUSD;
    }

    function setMinContribution(uint256 _valueInUSD) external onlyOwner {
        _minContributionUSD = _valueInUSD;
    }

    function withdrawTokens(
        address _tokenAddress,
        uint256 _value
    ) external onlyOwner {
        IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
    }
}
