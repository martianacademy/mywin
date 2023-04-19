// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IPriceOracle {
    function getPriceInUSD() external view returns (uint256);

    function getCurrencyDecimals() external view returns (uint8);
}

interface IReferral {
    function payReferralETHAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payStakingReferralAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool);

    function payStakingReferralInUSDTAdmin(
        uint256 _value,
        address _referee
    ) external returns (bool);
}

interface IVariables {
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
        );

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

contract StakingUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;
    address private _priceOracleContract;

    uint256 private _userIDsCount;
    uint256 private _stakingCount;
    uint256 private _totalValueStaked;
    uint256 private _totalValueStakedUSD;
    uint256 private _totalRewardsDistributed;

    uint16 private _rewardRateDecimals;
    uint256 private _minStakingValueInUSD;

    bool private _isPayReferralOnStaking;
    uint256 private _rewardClaimTimeLimit;

    uint8 private _maxPackageLength;

    uint256 private _minWithdrawLimit;
    uint256 private _minWithdrawLimitMultiplier;

    struct Account {
        uint256 userID;
        uint256[] stakingID;
        bool isDisabled;
        uint256[] blockNumber;
    }

    struct StakeInfo {
        bool isStaked;
        address owner;
        uint256 valueInETH;
        uint256 valueInUSD;
        uint256 rewardRate;
        uint256 startTime;
        uint256 duration;
        uint256 rewardClaimed;
        uint256 lastTimeRewardClaimed;
        uint256[] blockNumber;
    }

    struct Package {
        uint256 value;
        uint256 rewardRate;
        uint256 duration;
    }

    mapping(address => Account) private accounts;
    mapping(uint256 => address) private userID;
    mapping(uint256 => StakeInfo) private stakeInfo;
    mapping(uint256 => Package) private package;

    event Stake(
        address indexed userAddress,
        uint256 indexed valueinUSD,
        uint256 duration,
        uint256 stakingID
    );
    event StakingRewardClaimed(
        address indexed userAddress,
        uint256 indexed reward,
        uint256 indexed stakingID
    );
    event Unstake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed stakingID
    );

    event UserWithdrawFunds(address indexed userAddress, uint256 indexed value);

    function initialize() public initializer {
        _minStakingValueInUSD = 10000000000000000000;
        _isPayReferralOnStaking = true;
        _rewardRateDecimals = 1000;
        _rewardClaimTimeLimit = 1 days;
        _maxPackageLength = 3;
        _minWithdrawLimit = 10000000000000000000;
        _minWithdrawLimitMultiplier = 10;
        _userIDsCount = 1000;
        _stakingCount = 1000;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function _getPackage(
        uint256 _packageID
    ) private view returns (Package memory) {
        return package[_packageID];
    }

    function getPackages()
        external
        view
        returns (
            uint256[] memory valuesInDecimals,
            uint256[] memory rewardRateInPer,
            uint256[] memory durationInDays,
            uint256 count
        )
    {
        uint256[] memory _packageValues = new uint256[](_maxPackageLength);
        uint256[] memory _packageRates = new uint256[](_maxPackageLength);
        uint256[] memory _packageDurations = new uint256[](_maxPackageLength);

        for (uint256 i; i < _maxPackageLength; i++) {
            _packageValues[i] = _getPackage(i).value;
            _packageRates[i] = _getPackage(i).rewardRate;
            _packageDurations[i] = _getPackage(i).duration;
            count++;
        }

        valuesInDecimals = _packageValues;
        rewardRateInPer = _packageRates;
        durationInDays = _packageDurations;
    }

    function _setPackage(
        uint256[] memory _valuesInDecimals,
        uint256[] memory _rewardRateInPer,
        uint256[] memory _durationsInDays
    ) private {
        uint256 packageLength = _valuesInDecimals.length;
        require(packageLength <= _maxPackageLength, "Exceeding package length");

        for (uint256 i; i < packageLength; i++) {
            package[i].value = _valuesInDecimals[i];
            package[i].rewardRate = _rewardRateInPer[i];
            package[i].duration = _durationsInDays[i];
        }
    }

    function setPackage(
        uint256[] calldata _valuesInDecimals,
        uint256[] calldata _rewardRateInPer,
        uint256[] calldata _durationsInDays
    ) external onlyOwner {
        _setPackage(_valuesInDecimals, _rewardRateInPer, _durationsInDays);
    }

    function _stakeInfoMap(
        uint256 _stakingID
    ) private view returns (StakeInfo memory) {
        return stakeInfo[_stakingID];
    }

    function stakeInfoMap(
        uint256 _stakingID
    ) external view returns (StakeInfo memory) {
        return stakeInfo[_stakingID];
    }

    function _userAccountMap(
        address _userAddress
    ) private view returns (Account memory) {
        return accounts[_userAddress];
    }

    function userAccountMap(
        address _userAddress
    ) external view returns (Account memory) {
        return accounts[_userAddress];
    }

    function _idToAddress(uint256 _userID) private view returns (address) {
        return userID[_userID];
    }

    function _stake(
        address _address,
        uint256 _valueInUSD,
        uint256 _rewardRate,
        uint256 _duration
    ) private {
        _stakingCount++;

        uint256 _stakingID = _stakingCount;
        uint256 _currentTime = block.timestamp;
        uint256 _currentBlock = block.number;

        Account storage userAccount = accounts[_address];
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];

        if (userAccount.userID == 0) {
            _userIDsCount++;
            userAccount.userID = _userIDsCount;
            userID[_userIDsCount] = _address;
        }

        userAccount.stakingID.push(_stakingID);
        userAccount.blockNumber.push(_currentBlock);

        userStakingInfo.isStaked = true;
        userStakingInfo.owner = _address;
        userStakingInfo.startTime = _currentTime;
        userStakingInfo.duration = _duration;
        userStakingInfo.valueInUSD = _valueInUSD;
        userStakingInfo.rewardRate = _rewardRate;
        userStakingInfo.blockNumber.push(_currentBlock);

        _totalValueStakedUSD += _valueInUSD;

        emit Stake(_address, _valueInUSD, _duration, _stakingID);
    }

    function stake(
        address _referrerAddress,
        uint256 _packageID
    ) external payable whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = msg.value;
        uint256 _valueInUSD = _ethToUSD(_msgValue);
        address _referralContract = IVariables(_variablesContract)
            .getReferralContract();
        require(
            _valueInUSD >= _minStakingValueInUSD,
            "Staking value should be >= minStakingValueInUSD."
        );
        Package storage packageInfo = package[_packageID];

        _stake(
            _msgSender,
            _valueInUSD,
            packageInfo.rewardRate,
            packageInfo.duration
        );

        if (_isPayReferralOnStaking) {
            IReferral(_referralContract).payReferralETHAdmin(
                _msgValue,
                _msgSender,
                _referrerAddress
            );
        }
    }

    function stakeByAdmin(
        address _userAddress,
        address _referrerAddress,
        uint256 _valueInWei,
        uint256 _packageID
    ) external onlyOwner whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _valueInUSD = _ethToUSD(_valueInWei);
        address _referralContract = IVariables(_variablesContract)
            .getReferralContract();
        require(
            _valueInUSD >= _minStakingValueInUSD,
            "Staking value should be >= minStakingValue."
        );

        Package storage packageInfo = package[_packageID];

        _stake(
            _userAddress,
            _valueInUSD,
            packageInfo.rewardRate,
            packageInfo.duration
        );

        if (_isPayReferralOnStaking) {
            IReferral(_referralContract).payReferralETHAdmin(
                _valueInWei,
                _msgSender,
                _referrerAddress
            );
        }
    }

    function _getStakingReward(
        uint256 _stakingID
    ) private view returns (uint256 stakingReward) {
        uint256 currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 stakingTimePassed = currentTime - userStakingInfo.startTime;

        uint256 baseReward = ((userStakingInfo.valueInUSD *
            userStakingInfo.rewardRate) / _rewardRateDecimals) /
            userStakingInfo.duration;
        stakingReward =
            baseReward *
            _min(stakingTimePassed, userStakingInfo.duration) -
            userStakingInfo.rewardClaimed;

        return stakingReward;
    }

    function getStakingReward(
        uint256 _stakingID
    ) external view returns (uint256) {
        return _getStakingReward(_stakingID);
    }

    function getUserAllStakingsRewards(
        address _userAddress
    ) external view returns (uint256) {
        uint256[] memory userStakingIDs = accounts[_userAddress].stakingID;
        uint256 stakingIDLength = userStakingIDs.length;
        uint256 userAllStakingRewards;

        for (uint8 i; i < stakingIDLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked == true) {
                userAllStakingRewards += _getStakingReward(userStakingIDs[i]);
            }
        }

        return userAllStakingRewards;
    }

    function _claimReward(
        address _userAddress,
        uint256 _stakingID,
        StakeInfo storage userStakingInfo,
        Account storage userAccount,
        uint256 stakingReward,
        uint256 _currentBlock
    ) private returns (uint256) {
        userStakingInfo.rewardClaimed += stakingReward;
        userStakingInfo.lastTimeRewardClaimed = block.timestamp;
        userStakingInfo.blockNumber.push(_currentBlock);
        userAccount.blockNumber.push(_currentBlock);
        _totalRewardsDistributed += stakingReward;
        emit StakingRewardClaimed(_userAddress, stakingReward, _stakingID);

        return stakingReward;
    }

    function claimStakingReward(uint256 _stakingID) external {
        address _msgSender = msg.sender;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        Account storage userAccount = accounts[_msgSender];
        uint256 _currentBlock = block.number;
        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contract admin."
        );
        require(userStakingInfo.isStaked == true, "Staking is not active");
        require(userStakingInfo.owner == _msgSender, "Sorry you are not owner");
        require(
            userStakingInfo.lastTimeRewardClaimed + _rewardClaimTimeLimit >
                block.timestamp,
            "Your last reward claim time limit is not over yet."
        );
        uint256 stakingReward = _getStakingReward(_stakingID);

        _claimReward(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            stakingReward,
            _currentBlock
        );
    }

    function claimStakingRewardAdmin(
        uint256[] calldata _stakingIDs
    ) external onlyOwner {
        address userAddress;
        uint256 stakingID;
        uint256 stakingReward;
        StakeInfo storage userStakingInfo = stakeInfo[stakingID];
        Account storage userAccount = accounts[userAddress];
        uint256 _currentBlock = block.number;

        for (uint256 i; i < _stakingIDs.length; i++) {
            stakingID = _stakingIDs[i];
            userAddress = userStakingInfo.owner;
            stakingReward = _getStakingReward(stakingID);

            _claimReward(
                userAddress,
                stakingID,
                userStakingInfo,
                userAccount,
                stakingReward,
                _currentBlock
            );
        }
    }

    function _unStake(
        address _userAddress,
        uint256 _stakingID,
        StakeInfo storage _userStakingInfo,
        Account storage _userAccount,
        uint256 _currentBlock
    ) private returns (uint256) {
        _userStakingInfo.isStaked = false;
        _userStakingInfo.blockNumber.push(_currentBlock);
        _userAccount.blockNumber.push(_currentBlock);

        _totalValueStaked -= _userStakingInfo.valueInUSD;

        emit Unstake(_userAddress, _userStakingInfo.valueInUSD, _stakingID);
        return _userStakingInfo.valueInUSD;
    }

    function unStake(uint256 _stakingID) external {
        address _msgSender = msg.sender;
        uint256 _currentBlock = block.number;
        uint256 _currentTime = block.timestamp;
        Account storage userAccount = accounts[_msgSender];
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contract admin."
        );
        require(userStakingInfo.isStaked, "Staking is not active");
        require(
            userStakingInfo.owner == _msgSender,
            "Sorry you are not owner of this staking"
        );
        require(
            userStakingInfo.startTime + userStakingInfo.duration > _currentTime,
            "You staking is not over yet"
        );

        uint256 stakingReward = _getStakingReward(_stakingID);
        _claimReward(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            stakingReward,
            _currentBlock
        );
        _unStake(
            _msgSender,
            _stakingID,
            userStakingInfo,
            userAccount,
            _currentBlock
        );
    }

    function isStaked(address _userAddress) public view returns (bool) {
        Account storage userAccount = accounts[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked) {
                return true;
            }
        }

        return false;
    }

    function getUserTotalStakedValue(
        address _userAddress
    ) external view returns (uint256 userTotalValueStaked) {
        Account storage userAccount = accounts[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            if (_stakeInfoMap(userStakingIDs[i]).isStaked) {
                userTotalValueStaked += _stakeInfoMap(userStakingIDs[i])
                    .valueInUSD;
            }
        }
    }

    function getUserStakingIDs(
        address _userAddress
    ) public view returns (uint256[] memory) {
        return accounts[_userAddress].stakingID;
    }

    function getUserTotalRewardClaimed(
        address _userAddress
    ) external view returns (uint256 totalRewardClaim) {
        Account storage userAccount = accounts[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingID;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            totalRewardClaim += _stakeInfoMap(userStakingIDs[i]).rewardClaimed;
        }
    }

    function getStakingTimeRemaining(
        uint256 _stakingID
    ) external view returns (uint256) {
        uint256 _currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 endTime = userStakingInfo.startTime + userStakingInfo.duration;
        if (_currentTime < endTime) {
            return
                userStakingInfo.startTime +
                userStakingInfo.duration -
                _currentTime;
        }

        return 0;
    }

    function isAccountDisabled(
        address _userAddress
    ) public view returns (bool) {
        Account storage userAccount = accounts[_userAddress];
        return userAccount.isDisabled;
    }

    function getDisabledUsersList() external view returns (address[] memory) {
        uint256 totalUsers = _userIDsCount;
        uint256 _userID;
        address _userAddress = _idToAddress(_userID);
        Account storage userAccount = accounts[_userAddress];

        uint256 disabledUsersCount;

        for (uint256 i = 1000; i < totalUsers; i++) {
            _userID = i;
            if (userAccount.isDisabled) {
                disabledUsersCount++;
            }
        }

        address[] memory userAddressArray = new address[](disabledUsersCount);
        disabledUsersCount = 0;

        for (uint256 i = 1000; i < totalUsers; i++) {
            _userID = i;
            if (userAccount.isDisabled) {
                userAddressArray[disabledUsersCount] = _userAddress;
                disabledUsersCount++;
            }
        }

        return userAddressArray;
    }

    function disableAccounts(
        address[] calldata _userAddress
    ) external onlyOwner {
        address userAddress;
        Account storage userAccount = accounts[userAddress];
        uint256 userAddressLength = _userAddress.length;

        for (uint256 i; i < userAddressLength; i++) {
            userAddress = _userAddress[i];
            userAccount.isDisabled = true;
        }
    }

    function enableAccounts(
        address[] calldata _userAddress
    ) external onlyOwner {
        address userAddress;
        Account storage userAccount = accounts[userAddress];
        uint256 userAddressLength = _userAddress.length;

        for (uint256 i; i < userAddressLength; i++) {
            userAddress = _userAddress[i];
            userAccount.isDisabled = false;
        }
    }

    function getActiveStakingIDs() public view returns (uint256[] memory) {
        uint256 totalStakingsCount = _stakingCount;
        uint256 _stakingID;
        StakeInfo storage _userStakingInfo = stakeInfo[_stakingID];
        uint256[] memory activeStakingIDs = new uint256[](totalStakingsCount);
        uint256 activeStakingCount;

        for (uint256 i = 1000; i < _stakingCount; i++) {
            _stakingID = i;
            if (_userStakingInfo.isStaked) {
                activeStakingIDs[activeStakingCount] = _stakingID;
                activeStakingCount++;
            }
        }

        return activeStakingIDs;
    }

    function activeStakersList() external view returns (address[] memory) {
        uint256 totalStakers = _userIDsCount;
        uint256 _userID;
        address _userAddress = _idToAddress(_userID);
        address[] memory activeStakersArray = new address[](totalStakers);
        uint256 activeStakersLength;

        for (uint256 i = 1000; i < totalStakers; i++) {
            _userID = i;

            if (_isAddressInList(activeStakersArray, _userAddress) == true) {
                continue;
            }

            if (isStaked(_userAddress)) {
                activeStakersArray[activeStakersLength] = _userAddress;
                activeStakersLength++;
            }
        }

        return activeStakersArray;
    }

    function usersList() external view returns (address[] memory) {
        uint256 totalStakers = _userIDsCount;
        address[] memory stakersArray = new address[](totalStakers);
        uint256 stakersArrayLength;

        for (uint256 i = 1000; i < totalStakers; i++) {
            stakersArray[stakersArrayLength] = _idToAddress(i);
            stakersArrayLength++;
        }

        return stakersArray;
    }

    function getTotalValueStaked() external view returns (uint256) {
        return _totalValueStaked;
    }

    function getTotalStakingRewardDistributed()
        external
        view
        returns (uint256)
    {
        return _totalRewardsDistributed;
    }

    function getStakingCappings()
        external
        view
        returns (
            uint256 priceInUSD,
            uint256 minStakingValueInUSD,
            uint256 timeLimitRewardClaim,
            bool payReferralOnStaking,
            uint8 maxPackageLength,
            uint256 rewardRateDecimals,
            uint256 minWithdrawLimit,
            uint256 minWithdrawLimitMultiplier
        )
    {
        priceInUSD = IPriceOracle(_priceOracleContract).getPriceInUSD();
        minStakingValueInUSD = _minStakingValueInUSD;
        timeLimitRewardClaim = _rewardClaimTimeLimit;
        payReferralOnStaking = _isPayReferralOnStaking;
        maxPackageLength = _maxPackageLength;
        rewardRateDecimals = _rewardRateDecimals;
        minWithdrawLimit = _minWithdrawLimit;
        minWithdrawLimitMultiplier = _minWithdrawLimitMultiplier;
    }

    function setMinWithdrawLimit(uint256 _valueInWei) external onlyOwner {
        _minWithdrawLimit = _valueInWei;
    }

    function setMinWithdrawLimitMultiplier(
        uint256 _valueInWei
    ) external onlyOwner {
        _minWithdrawLimitMultiplier = _valueInWei;
    }

    function setMinStakingValueInUSD(
        uint256 _valueInUSD
    ) external onlyOwner returns (uint256) {
        _minStakingValueInUSD = _valueInUSD;
        return _minStakingValueInUSD;
    }

    function setTimeLimitRewardClaim(
        uint256 _valueInSeconds
    ) external onlyOwner {
        _rewardClaimTimeLimit = _valueInSeconds;
    }

    function setIsPayReferralOnStaking(
        bool _value
    ) external onlyOwner returns (bool) {
        _isPayReferralOnStaking = _value;
        return _isPayReferralOnStaking;
    }

    function setMaxPackageLength(uint8 _valueInDecimals) external onlyOwner {
        _maxPackageLength = _valueInDecimals;
    }

    function setRewardRateDecimals(uint8 _valueInDecimals) external onlyOwner {
        _rewardRateDecimals = _valueInDecimals;
    }

    function _isAddressInList(
        address[] memory _addressList,
        address _addressToSearch
    ) private pure returns (bool) {
        for (uint256 i; i < _addressList.length; i++) {
            if (_addressList[i] == _addressToSearch) {
                return true;
            }
        }

        return false;
    }

    function isInMultipleOf(
        uint256 _valueInWei,
        uint256 _decimals,
        uint256 _division
    ) private pure returns (uint256) {
        uint256 value = _valueInWei / 10 ** _decimals / _division;
        return value * _division * 10 ** _decimals;
    }

    function getClaimableBalance(
        address _userAddress
    ) external view returns (uint256) {
        uint256 userBalanceUSD = IVariables(_variablesContract).getUserBalance(
            _userAddress
        );

        return
            isInMultipleOf(
                userBalanceUSD,
                IPriceOracle(_priceOracleContract).getCurrencyDecimals(),
                _minWithdrawLimitMultiplier
            );
    }

    function _ethToUSD(uint256 _valueInWei) private view returns (uint256) {
        uint256 value = (_valueInWei *
            IPriceOracle(_priceOracleContract).getPriceInUSD()) / 10 ** 18;
        return value;
    }

    function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
        uint256 value = (_valueInUSD * 10 ** 18) /
            IPriceOracle(_priceOracleContract).getPriceInUSD();
        return value;
    }

    /*Admin function*/

    function withdrawTokens(
        address _tokenAddress,
        address _receiver,
        uint256 _value
    ) external onlyOwner returns (bool) {
        IERC20Upgradeable(_tokenAddress).transfer(_receiver, _value);
        return true;
    }

    function withdrawNativeFunds(
        address _receiver,
        uint256 _value
    ) external onlyOwner returns (bool) {
        payable(_receiver).transfer(_value);
        return true;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function _getCurrentTime() private view returns (uint256 currentTime) {
        currentTime = block.timestamp;
        return currentTime;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}
