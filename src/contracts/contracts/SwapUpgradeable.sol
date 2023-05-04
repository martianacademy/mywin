//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVariables {

    function isAdmin(address _address) external view returns (bool);

    function getPriceOracleContract() external view returns (address);

    function getROIContract() external view returns (address);

    function getFutureSecureWalletContract() external view returns (address);

    function getRewardContract() external view returns (address);

    function getReferralContract() external view returns (address);
}

interface IPriceOracle {
    function getPriceInUSD() external view returns (uint256);
}

interface IReferral {
    function increaseIdCount() external returns (uint32);
    function payReferralETH() external;
    function payReferralUSD() external;
}

interface IROI {
    function isIdActive(uint32 _id) external view returns (bool);
}

interface IFutureWallet {
    function stakeByAdmin(address _userAddress, uint256 _value) external;
}

contract ReferralV3Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;
    uint256 private _minContributionInUSD;


    bool private _isPayReferral;
    bool private _isROIEnabled;
    bool private _isFutureWalletEnabled;

    address[] private _totalUsers;
    address[] private _disabledUsersList;

    uint256 private _usdRaised;
    uint256 private _ethSwapped;

    struct StructAccount {
        bool isActive;
        uint32[] accountIds;
    }

    mapping(address => StructAccount) private accounts;

    event DeactivatedId(uint32 id, string reason);
    event ActivatedId(uint32 id);
    event Swap(uint256 amountIn, uint256 amountOut, string currencyIn);

    function initialize() public initializer {
        _variablesContract = 0x286d6392042B4D7180Fd6d20F8D35c8776815774;
        _minContributionInUSD = 100000000000000000000;
        _isPayReferral = true;
        _isROIEnabled = true;
        _isFutureWalletEnabled = true;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    modifier onlyAdmin() {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin."
        );
        _;
    }

    function activateId() external {}
    function topUpId() external {}
    function swap() external {}

    function getUserAccount(
        address _address
    ) external view returns (StructAccount memory) {
        return accounts[_address];
    }

    function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
        uint256 value = (_valueInUSD * 10 ** 18) /
            IPriceOracle(IVariables(_variablesContract).getPriceOracleContract()).getPriceInUSD();
        return value;
    }

    function setMinContribution(uint256 _valueInUSD) external onlyOwner {
        _minContributionInUSD = _valueInUSD;
    }

    function getMinContributionETH() external view returns (uint256) {
        return _usdToETH(_minContributionInUSD);
    }

    function sendETHAdmin(address _address, uint256 _value) external onlyOwner {
        payable(_address).transfer(_value);
    }

    function withdrawETHAdmin() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawTokensAdmin(
        address _tokenAddress,
        uint256 _value
    ) external onlyOwner {
        IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
