// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVariables {

    function referralContract() external view returns (address);
    function stakingContract() external view returns (address);
}

contract FutureSecureWallet is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;
    address[] private _stakers;
    uint256 private _valueStaked;
    uint256 private _rewardDistributed;

    uint16 private _stakingRewardRate;
    uint256 private _stakingDuration;
    uint256 private _stakingRewardClaimTimeLimit;

    struct Account {
        uint256[] stakingIDs;
        bool isDisabled;
        uint256 rewardClaimedTimestamp;
        uint256 rewardClaimed;
    }

    struct StakeInfo {
        bool isStaked;
        uint32 id;
        address owner;
        uint256 value;
        uint16 rewardRate;
        uint256 startTime;
        uint256 duration;
    }

    mapping(address => Account) private account;
    mapping(uint256 => StakeInfo) private stakeInfo;

    event Stake(
        address indexed userAddress,
        uint256 indexed valueStaked,
        uint256 indexed duration,
        uint256 stakingID
    );

    event StakingRewardClaimed(
        address indexed userAddress,
        uint256 indexed reward
    );

    event PrincipalClaimed(address indexed userAddress, uint256 amount);

    event IDUnStaked(
        address indexed userAddress,
        uint256 indexed value,
        uint256 indexed stakingID
    );

    event UnStaked(
        address indexed userAddress,
        uint256 indexed value
    );

    function initialize() public initializer {
        _variablesContract = 0x77daaFc7411C911b869C71bf70FE36cCE507845d;
        _stakingRewardRate = 60;
        _stakingDuration = 365 days;
        _stakingRewardClaimTimeLimit = 30 days;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function stakeInfoMap(
        uint256 _stakingID
    ) external view returns (StakeInfo memory) {
        return stakeInfo[_stakingID];
    }

    function userAccountMap(
        address _userAddress
    ) external view returns (Account memory) {
        return account[_userAddress];
    }

    function _stake(
        address _address,
        uint256 _value,
        uint16 _rewardRate,
        uint256 _duration
    ) private {
        _stakers.push(_address);

        uint32 stakingID = uint32(_stakers.length);
        uint256 currentTime = block.timestamp;

        Account storage userAccount = account[_address];
        StakeInfo storage userStakingInfo = stakeInfo[stakingID];

        userAccount.stakingIDs.push(stakingID);
        userStakingInfo.id = stakingID;
        userStakingInfo.isStaked = true;
        userStakingInfo.owner = _address;
        userStakingInfo.startTime = currentTime;
        userStakingInfo.duration = _duration;
        userStakingInfo.value = _value;
        userStakingInfo.rewardRate = _rewardRate;

        _valueStaked += _value;

        emit Stake(_address, _value, _duration, stakingID);
    }

    function stakeByAdmin(
        address _userAddress,
        uint256 _value
    ) external onlyOwner {
        address _msgSender = msg.sender;
        IVariables variables = IVariables(_variablesContract);
        require(
            _msgSender == owner() || _msgSender == variables.referralContract() ,
            "Only owner can call this function."
        );

        _stake(
            _userAddress,
            _value,
            _stakingRewardRate,
            _stakingDuration
        );
    }

    function _getStakingReward(
        uint256 _stakingID
    ) private view returns (uint256 stakingReward) {
        uint256 currentTime = block.timestamp;
        StakeInfo storage userStakingInfo = stakeInfo[_stakingID];
        uint256 stakingTimePassed = currentTime - userStakingInfo.startTime;

        uint256 baseReward = ((userStakingInfo.value *
            userStakingInfo.rewardRate) / 100) / userStakingInfo.duration;
        stakingReward =
            baseReward *
            _min(stakingTimePassed, userStakingInfo.duration);
    }

    function _getAllStakingReward (uint256[] storage _stakingIDs) private view returns (uint256 allStakingsReward) {
        uint256 stakingIDLength = _stakingIDs.length;

        for (uint16 i; i < stakingIDLength; i++) {
            allStakingsReward += _getStakingReward(
                    _stakingIDs[i]
            );
        }
    }

    function getUserAllStakingsRewards(
        address _userAddress
    ) external view returns (uint256) {
        return _getAllStakingReward(account[_userAddress].stakingIDs);
    }

    function _claimStakingReward(Account storage _userAccount, uint256 _reward) private {
        userAccount.rewardClaimed += stakingRewards;
        userAccount.rewardClaimedTimestamp = _currentTime;
        emit StakingRewardClaimed(
            _msgSender,
            stakingRewards
        );
    }

    function claimStakingReward() external {
        address _msgSender = msg.sender;
        Account storage userAccount = account[_msgSender];
        uint256 stakingRewards = _getAllStakingReward(account[_msgSender].stakingIDs)  - userAccount.rewardClaimed;
        require(stakingRewards > 0, "You have no staking or ended");
        uint256 _currentTime = block.timestamp;

        require(
            !userAccount.isDisabled,
            "Your account is disabled. Please contact admin."
        );

        require(
            userAccount.rewardClaimedTimestamp +
                _stakingRewardClaimTimeLimit >
                _currentTime,
            "You cannot claim reward before timelimit."
        );

        payable(_msgSender).transfer(stakingRewards);

        
    }

    function _getUnStakingValue(address _userAddress) private view returns (uint256 unstakingValue) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingIDs;
        uint256 userStakingIDsLength = userStakingIDs.length;
        uint256 _currentTime = block.timestamp;

        for (uint256 i; i < userStakingIDsLength; i++) {
            StakeInfo storage userStakeInfo = stakeInfo[userStakingIDs[i]];
            if(userStakeInfo.isStaked) {
                if (userStakeInfo.startTime + userStakeInfo.duration > _currentTime) {
                    unstakingValue += userStakeInfo.value;
                }
            }
            
        }
    }

    function _unStake(address _userAddress) private returns (uint256 unstakeValue) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingIDs;
        uint256 userStakingIDsLength = userStakingIDs.length;
        uint256 _currentTime = block.timestamp;

        for (uint256 i; i < userStakingIDsLength; i++) {
            StakeInfo storage userStakeInfo = stakeInfo[userStakingIDs[i]];
            if(userStakeInfo.isStaked) {
                if (userStakeInfo.startTime + userStakeInfo.duration > _currentTime) {
                    unstakeValue += userStakeInfo.value;
                    userStakeInfo.isStaked = false;
                    emit IDUnStaked(_userAddress, userStakeInfo.value, userStakeInfo.id);
                }
            }
            
        }
    }

    function getUserUnStakingValue(address _userAddress) external view returns (uint256) {
        return _getUnStakingValue(_userAddress);
    }

    function unStake() external {
        address _msgSender = msg.sender;
        Account storage userAccount = account[_userAddress];
        uint256 stakingReward = _getAllStakingReward (userAccount.stakingIDs);
        uint256 unStakeValue = _unStake(_msgSender);


        payable(_msgSender).transfer(unStakeValue);
         emit UnStaked(
        _msgSender,
        unStakeValue
    );
    }

    function isStaked(address _userAddress) public view returns (bool) {
        Account storage userAccount = account[_userAddress];

        if(userAccount.stakingIDs.length > 0) {
            StakeInfo storage userStakingInfo = stakeInfo[userAccount.stakingIDs.length - 1];
            return userStakingInfo.startTime + userStakingInfo.duration < block.timestamp ? true : false;
        }

        return false;
    }

    function getUserTotalValueStaked(
        address _userAddress
    ) external view returns (uint256 token) {
        Account storage userAccount = account[_userAddress];
        uint256[] memory userStakingIDs = userAccount.stakingIDs;
        uint256 userStakingIDsLength = userStakingIDs.length;

        for (uint256 i; i < userStakingIDsLength; i++) {
            StakeInfo storage userStakeInfo = stakeInfo[userStakingIDs[i]];
            if (userStakeInfo.isStaked) {
                token += userStakeInfo.value;
            }
        }
    }

    function getUserStakingIDs(
        address _userAddress
    ) public view returns (uint256[] memory) {
        return account[_userAddress].stakingIDs;
    }

    function getUserTotalRewardClaimedToken(
        address _userAddress
    ) external view returns (uint256) {
        return account[_userAddress].rewardClaimed;
        
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
        Account storage userAccount = account[_userAddress];
        return userAccount.isDisabled;
    }

    function getDisabledAccountsList()
        external
        view
        returns (address[] memory)
    {
        address userAddress;
        Account storage userAccount = account[userAddress];
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory disabledAddressArray = new address[](totalStakers);
        uint256 disabledStakersLength;

        for (uint256 i; i < totalStakers; i++) {
            userAddress = stakers[i];
            if (_isAddressInList(disabledAddressArray, userAddress) == true) {
                continue;
            }

            if (userAccount.isDisabled == true) {
                disabledAddressArray[disabledStakersLength] = userAddress;
                disabledStakersLength++;
            }
        }

        return disabledAddressArray;
    }

    function disableAccounts(
        address[] calldata _userAddress
    ) external onlyOwner {
        address userAddress;
        Account storage userAccount = account[userAddress];
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
        Account storage userAccount = account[userAddress];
        uint256 userAddressLength = _userAddress.length;

        for (uint256 i; i < userAddressLength; i++) {
            userAddress = _userAddress[i];
            userAccount.isDisabled = false;
        }
    }

    function getActiveStakingIDs() public view returns (uint256[] memory) {
        uint256 stakingIDsLength = _stakers.length;

        uint256[] memory stakingIDsArray = new uint256[](stakingIDsLength);

        for (uint256 i; i < stakingIDsLength; i++) {
            StakeInfo storage userStakingInfo = stakeInfo[i];
            if (userStakingInfo.isStaked == true) {
                if (i != 0) {
                    stakingIDsArray[i] = i;
                }
            }
        }

        return stakingIDsArray;
    }

    function activeStakersList() external view returns (address[] memory) {
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory activeStakersArray = new address[](totalStakers);
        uint256 activeStakersLength;

        for (uint256 i; i < totalStakers; i++) {
            if (_isAddressInList(activeStakersArray, stakers[i]) == true) {
                continue;
            }

            if (isStaked(stakers[i])) {
                activeStakersArray[activeStakersLength] = stakers[i];
                activeStakersLength++;
            }
        }

        return activeStakersArray;
    }

    function allStakersList() external view returns (address[] memory) {
        address[] memory stakers = _stakers;
        uint256 totalStakers = stakers.length;
        address[] memory stakersArray = new address[](totalStakers);
        uint256 stakersArrayLength;

        for (uint256 i; i < totalStakers; i++) {
            if (_isAddressInList(stakersArray, stakers[i]) == true) {
                continue;
            }

            stakersArray[stakersArrayLength] = stakers[i];
            stakersArrayLength++;
        }

        return stakersArray;
    }

    function getTotalValueStaked()
        external
        view
        returns (uint256 token)
    {
        token = _valueStaked;
    }

    function getTotalStakingRewardDistributed()
        external
        view
        returns (uint256 _tokenRewards)
    {
        _tokenRewards = _rewardDistributed;
    }

    function getStakingCappings()
        external
        view
        returns (
            uint256 stakingRewardRate,
            uint256 stakingDuration,
            uint256 stakingRewardClaimTimeLimit
        )
    {
        stakingRewardRate = _stakingRewardRate;
        stakingDuration = _stakingDuration;
        stakingRewardClaimTimeLimit = _stakingRewardClaimTimeLimit;
    }


    function setStakingRewardRate(uint16 _valueInPer) external onlyOwner {
        _stakingRewardRate = _valueInPer;
    }

    function setStakingDuration(uint256 _valueInDays) external onlyOwner {
        _stakingDuration = _valueInDays * 1 days;
    }

    function setStakingRewardClaimTimeLimity(
        uint256 _valueInDays
    ) external onlyOwner {
        _stakingRewardClaimTimeLimit = _valueInDays * 1 days;
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

    // function _token_usd_out_value(
    //     uint256 _tokenValueIn,
    //     address _tokenContract,
    //     address _usdContract
    // ) private view returns (uint256) {
    //     address[] memory tokenArray = new address[](2);
    //     tokenArray[0] = _tokenContract;
    //     tokenArray[1] = _usdContract;

    //     IVariables variables = IVariables(_variablesContract);

    //     uint256[] memory amounts = IUniswapRouter(
    //         variables.uniswapV2RouterContract()
    //     ).getAmountsOut(_tokenValueIn, tokenArray);

    //     return amounts[1];
    // }

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
