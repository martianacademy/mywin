// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IPriceOracle {
    function getPriceInUSD() external view returns (uint256);
}

contract ReferralV2Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _priceOracleContract;

    uint16[] public levelRates;
    uint16 public decimals;

    uint8 public maxLevelsCount;

    uint256 public minContributionInUSD;

    uint256 public totalRoyaltyClubBonusPaidUSD;
    uint256 public totalRoyaltyClubBonusPaidETH;

    uint32 public totalUsers;
    uint32 public totalIDs;
    uint32 public totalROIIDs;

    uint16 private _roiRate;
    uint256 private _roiDuration;
    uint256 private _roiClaimTimelimit;

    bool public isPayROI;
    bool public isPayRoyaltyClubBonus;
    uint8 public royaltyClubPackageCount;

    uint8 private _userLevelUnlockMultiplier;

    uint256 public companyTurnoverWithTimeLimit;
    uint256 public companyTurnoverTimeStamp;
    uint256 public companyTurnoverTimeLimit;

    address[] public _disabledUsersList;

    struct StructAccount {
        bool isDisabled;
        uint32[] accountIDs;
    }

    struct StructID {
        uint32 id;
        string oldID;
        bool isDisabled;
        address owner;
        uint256 joiningTime;
        uint256 activationTime;
        uint256 deactivateTime;
        uint32[] roiIDs;
        uint32 refererID;
        uint32[] refereeIDs;
        uint32[] teamIDs;
        uint256 selfBusinessUSD;
        uint256 selfBusinessUSDOld;
        uint256 directBusinessUSD;
        uint256 directBusinessUSDOld;
        uint256 teamBusinessUSD;
        uint256 teamBusinessUSDOld;
        uint256 royaltyClubBusinessUSD;
        uint256 timeStampRoyaltyClub;
        uint8 royaltyClubPackageID;
        uint256 royaltyClubListIndex;
        uint256 referralPaidUSD;
        uint256 rewardPaidRoyaltyClubUSD;
        uint256 topUpUSD;
        uint256 balanceClaimedUSD;
        uint256 limitBalanceUSD;
        uint256 maxLimitAmount;
        uint256 roiClaimedUSD;
        uint256 roiClaimTimestamp;
    }

    struct StructROI {
        bool isActive;
        uint32 ownerID;
        uint256 valueInUSD;
        uint16 roiRate;
        uint256 startTime;
        uint256 duration;
        uint256 roiClaimed;
    }

    struct StructPackages {
        uint8 packageID;
        uint256 selfBusinessUSD;
        uint256 directBusinessUSD;
        uint256 teamBusinessUSD;
        string rankName;
        uint256 reward;
        uint256 businessLimit;
        uint256 timeLimit;
        bool isOneTimeRewardPaid;
        bool isPayReccursive;
        uint32[] achieversList;
    }

    uint8 public packagesCount;

    mapping(address => StructAccount) private accounts;
    mapping(uint32 => StructID) private ids;
    mapping(uint32 => StructROI) private rois;
    mapping(uint8 => StructPackages) private packages;

    event IDActivated(uint256 id, uint256 valueInUSD, address userAddress);
    event IDDeactivated(uint256 id);

    event AccountInfoIDAttached(
        address ownerAddress,
        uint256 id,
        uint256 idIndex
    );

    event RegisteredReferer(uint256 indexed id, uint256 indexed refererID);

    event RegisteredTeamAddress(
        address indexed parent,
        uint256 parentAccountID,
        uint256 indexed referrerID,
        uint256 indexed refereeID
    );

    event RegisterRefererFailed(
        address indexed refereeID,
        address indexed referrerID,
        string indexed reason
    );

    event ReferralRewardPaid(
        uint256 indexed refereeID,
        uint256 indexed referrerID,
        uint256 indexed amount,
        uint256 level
    );

    event AddedInRoyaltyClubList(uint256 userID, uint256 index, uint256 rank);

    event RoyaltyClubBonusPaid(
        uint256 packageID,
        uint256 indexed userID,
        uint256 indexed amount
    );

    event ReferralNotPaid(
        uint256 indexed refererID,
        uint256 indexed level,
        string indexed reason
    );

    event PackageAdded(uint256 packageID);

    event PackageUpdated(uint256 packageID);

    event PackageRemoved(uint256 packageID);

    event ROIClaimed(uint256 indexed userID, uint256 indexed reward);

    function initialize() public initializer {
        _priceOracleContract = 0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168;

        decimals = 1000;
        levelRates = [
            100,
            70,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20
        ];

        maxLevelsCount = 50;

        minContributionInUSD = 1000000000000000000;

        _userLevelUnlockMultiplier = 2;

        isPayRoyaltyClubBonus = true;

        isPayROI = true;

        _roiRate = 1000;
        _roiDuration = 400 days;
        _roiClaimTimelimit = 20;

        companyTurnoverTimeLimit = 30 days;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function getUserAccount(
        address _address
    ) external view returns (StructAccount memory) {
        return accounts[_address];
    }

    function getIDAccount(uint32 _id) external view returns (StructID memory) {
        return ids[_id];
    }

    function setMaxLevelsCountAdmin(uint8 _valueInDecimals) external onlyOwner {
        maxLevelsCount = _valueInDecimals;
    }

    function setLevelDecimals(uint16 _value) external onlyOwner {
        decimals = _value;
    }

    function setLevelRates(uint8[] calldata _value) external onlyOwner {
        levelRates = _value;
    }

    function _getIDRoyalyClubLevel(
        uint32 _id
    ) private view returns (uint8 prevCount) {
        StructID memory accountInfo = ids[_id];
        uint8 _royaltyPackagesCount = packagesCount;

        for (uint8 i; i < _royaltyPackagesCount; i++) {
            if (
                accountInfo.selfBusinessUSD >= packages[i].selfBusinessUSD &&
                accountInfo.directBusinessUSD >=
                packages[i].directBusinessUSD &&
                accountInfo.teamBusinessUSD >= packages[i].teamBusinessUSD
            ) {
                prevCount = uint8(i);
            } else {
                break;
            }
        }
    }

    function getIDRoyaltyClubLevel(uint32 _id) public view returns (uint256) {
        return _getIDRoyalyClubLevel(_id);
    }

    function getRoyaltyClubPackageInfo(
        uint8 _packageID
    ) external view returns (StructPackages memory) {
        return packages[_packageID];
    }

    function getAchieversList(
        uint8 _packageID
    ) external view returns (uint32[] memory) {
        return packages[_packageID].achieversList;
    }

    function setRoyaltyClubPackage(
        uint8 packageID,
        uint256 selfBusinessUSD,
        uint256 directBusinessUSD,
        uint256 teamBusinessUSD,
        string memory rankName,
        uint256 reward,
        uint256 businessLimit,
        uint256 timeLimit,
        bool isPayReccursive
    ) external onlyOwner {
        StructPackages storage package = packages[packageID];
        package.packageID = packageID;
        package.selfBusinessUSD = selfBusinessUSD;
        package.directBusinessUSD = directBusinessUSD;
        package.teamBusinessUSD = teamBusinessUSD;
        package.rankName = rankName;
        package.reward = reward;
        package.businessLimit = businessLimit;
        package.timeLimit = timeLimit;
        package.isPayReccursive = isPayReccursive;

        emit PackageAdded(packageID);
    }

    function setRoyaltyPackageCount(uint8 _valueInDecimals) external onlyOwner {
        packagesCount = _valueInDecimals;
    }

    function payRoyaltyClubReccursiveBonusAdmin() external onlyOwner {
        uint8 _royaltyPackagesCount = packagesCount;

        for (uint8 i; i < _royaltyPackagesCount; i++) {
            StructPackages memory package = packages[i];
            if (!package.isPayReccursive) {
                continue;
            }

            uint32[] memory acheiversList = package.achieversList;
            uint32 achieversCount = uint32(acheiversList.length);
            uint256 valueToDistribute = (companyTurnoverWithTimeLimit *
                package.reward) /
                decimals /
                achieversCount;

            for (uint32 j; j < achieversCount; j++) {
                StructID storage userAccountInfoID = ids[acheiversList[j]];

                if (
                    userAccountInfoID.royaltyClubBusinessUSD >
                    package.businessLimit &&
                    userAccountInfoID.limitBalanceUSD <=
                    userAccountInfoID.maxLimitAmount
                ) {
                    userAccountInfoID.limitBalanceUSD += valueToDistribute;

                    emit RoyaltyClubBonusPaid(
                        package.packageID,
                        acheiversList[j],
                        valueToDistribute
                    );
                }
            }
        }

        companyTurnoverWithTimeLimit = 0;
        companyTurnoverTimeStamp = block.timestamp;
    }

    function _addReferrer(uint32 _userID, uint32 _referrerID) private {
        StructID storage userIDAccount = ids[_userID];
        userIDAccount.refererID = _referrerID;
        emit RegisteredReferer(_userID, _referrerID);

        uint8 _maxLevelCount = maxLevelsCount;

        for (uint256 i; i < _maxLevelCount; i++) {
            StructID storage referrerIDAccount = ids[userIDAccount.refererID];
            if (i == 0) {
                referrerIDAccount.refereeIDs.push(_userID);
            }

            if (userIDAccount.id == 0) {
                break;
            }

            referrerIDAccount.teamIDs.push(_userID);

            emit RegisteredTeamAddress(
                referrerIDAccount.owner,
                userIDAccount.refererID,
                _referrerID,
                _userID
            );

            userIDAccount = referrerIDAccount;
        }
    }

    function _checkAndDisableID(
        StructID storage _idAccount
    ) private returns (bool) {
        if (_idAccount.roiIDs.length > 0) {
            StructROI storage _roiAccount = rois[
                _idAccount.roiIDs[_idAccount.roiIDs.length - 1]
            ];

            if (_idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount) {
                _idAccount.isDisabled = true;
                _disableIDROIs(_idAccount);
                return true;
            } else if (
                block.timestamp > _roiAccount.startTime + _roiAccount.duration
            ) {
                uint256 totalROI;

                for (uint16 i; i < _idAccount.roiIDs.length; i++) {
                    totalROI += _getROI(_idAccount.roiIDs[i]);
                }

                uint256 totalRewards = _idAccount.limitBalanceUSD + totalROI;

                if (totalRewards >= _idAccount.maxLimitAmount) {
                    _idAccount.limitBalanceUSD = _idAccount.maxLimitAmount;
                } else {
                    _idAccount.maxLimitAmount = _idAccount.limitBalanceUSD;
                }

                _idAccount.isDisabled = true;
                _disableIDROIs(_idAccount);
            } else {
                return false;
            }
        }

        return false;
    }

    function _disableIDROIs(StructID storage _idAccount) private {
        uint32[] memory idROIIDs = _idAccount.roiIDs;

        for (uint256 i; i < idROIIDs.length; i++) {
            if (rois[idROIIDs[i]].isActive) {
                rois[idROIIDs[i]].isActive = false;
            }
        }
    }

    function _disableID(StructID storage _idAccount) private {
        _idAccount.isDisabled = true;
        _disableIDROIs(_idAccount);
    }

    function _idLimitBalance(
        StructID storage _idAccount
    ) private view returns (uint256) {
        return
            _idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount
                ? _idAccount.maxLimitAmount
                : _idAccount.limitBalanceUSD;
    }

    function _increaseIDLimitBalance(
        StructID storage _idAccount,
        uint256 _valueInUSD
    ) private {
        if (
            _idAccount.limitBalanceUSD + _valueInUSD >=
            _idAccount.maxLimitAmount
        ) {
            _idAccount.limitBalanceUSD = _idAccount.maxLimitAmount;
        } else {
            _idAccount.limitBalanceUSD + _valueInUSD;
        }
    }

    function _updateIDWithRoyaltyClub(
        uint32 _id,
        uint32 roiID,
        address _owner,
        uint256 _valueInUSD,
        uint256 _maxLimitUSD,
        uint256 _joiningTime,
        uint256 _activationTime,
        uint8 _levelsLength
    ) private {
        StructID storage userIDAccount = ids[_id];

        userIDAccount.owner = _owner;
        userIDAccount.roiIDs.push(roiID);
        userIDAccount.joiningTime = _joiningTime;
        userIDAccount.activationTime = _activationTime;
        userIDAccount.id = _id;
        userIDAccount.maxLimitAmount = _maxLimitUSD;
        userIDAccount.selfBusinessUSD += _valueInUSD;

        for (uint8 i; i < _levelsLength; i++) {
            uint32 refererID = userIDAccount.refererID;
            StructID storage refererIDAccount = ids[refererID];
            if (refererIDAccount.owner == address(0)) {
                break;
            }

            if (i == 0) {
                refererIDAccount.directBusinessUSD += _valueInUSD;
            }

            refererIDAccount.teamBusinessUSD += _valueInUSD;

            if (
                _getIDRoyalyClubLevel(refererID) >
                refererIDAccount.royaltyClubPackageID
            ) {
                refererIDAccount.royaltyClubPackageID = _getIDRoyalyClubLevel(
                    refererID
                );

                packages[refererIDAccount.royaltyClubPackageID]
                    .achieversList
                    .push(refererID);

                refererIDAccount.royaltyClubListIndex =
                    packages[refererIDAccount.royaltyClubPackageID]
                        .achieversList
                        .length -
                    1;

                emit AddedInRoyaltyClubList(
                    refererID,
                    refererIDAccount.royaltyClubListIndex,
                    refererIDAccount.royaltyClubPackageID
                );

                if (
                    packages[_getIDRoyalyClubLevel(refererID)].isPayReccursive
                ) {
                    if (
                        block.timestamp >
                        refererIDAccount.timeStampRoyaltyClub +
                            packages[_getIDRoyalyClubLevel(refererID)].timeLimit
                    ) {
                        refererIDAccount.timeStampRoyaltyClub = block.timestamp;
                        refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
                    } else {
                        refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
                    }
                } else {
                    if (isPayRoyaltyClubBonus) {
                        _increaseIDLimitBalance(
                            refererIDAccount,
                            packages[refererIDAccount.royaltyClubPackageID]
                                .reward
                        );

                        emit RoyaltyClubBonusPaid(
                            packages[refererIDAccount.royaltyClubPackageID]
                                .packageID,
                            refererID,
                            packages[refererIDAccount.royaltyClubPackageID]
                                .reward
                        );
                    }
                }
            }

            if (
                block.timestamp >
                companyTurnoverTimeStamp + companyTurnoverTimeLimit
            ) {
                companyTurnoverTimeStamp = block.timestamp;
                companyTurnoverWithTimeLimit = _valueInUSD;
            } else {
                companyTurnoverWithTimeLimit += _valueInUSD;
            }

            userIDAccount = refererIDAccount;
        }

        totalIDs++;
    }

    function activateID(uint32 _refererID) external payable {
        uint256 _valueInWei = msg.value;
        uint256 _valueInUSD = _ethToUSD(_valueInWei);

        require(
            _valueInWei >= _usdToETH(minContributionInUSD),
            "Value should be greate then 100"
        );

        address _msgSender = msg.sender;
        uint256 _currenTime = block.timestamp;
        uint32 _id = totalIDs + 1;
        uint32 _roiID = totalROIIDs + 1;

        StructAccount storage userAccount = accounts[_msgSender];

        _addReferrer(_id, _refererID);

        if (isPayROI) {
            _activateROI(_id, _roiID, _valueInUSD, _currenTime);
        }

        _updateIDWithRoyaltyClub(
            _id,
            _roiID,
            _msgSender,
            _valueInUSD,
            _valueInUSD * 3,
            _currenTime,
            _currenTime,
            maxLevelsCount
        );

        userAccount.accountIDs.push(_id);
    }

    function addReferrerAdmin(
        uint32[] calldata _id,
        uint32[] calldata _refererID
    ) external onlyOwner {
        require(
            _id.length == _refererID.length,
            "Input length didnot matched."
        );

        for (uint16 i; i < _id.length; i++) {
            if (_refererID[i] != 0) {
                _addReferrer(_id[i], _refererID[i]);
            }
        }
    }

    function _updateOldIDData(
        uint32 _userID,
        uint256 _totalTopUp,
        uint256 _limitBalanceUSD,
        uint256 _maxLimitUSD,
        uint256 _balanceClaimedUSD,
        uint256 _joiningTime,
        uint256 _activationTime
    ) private {
        StructID storage userIDAccount = ids[_userID];
        uint8 _maxLevelsCount = maxLevelsCount;

        userIDAccount.joiningTime = _joiningTime;
        userIDAccount.activationTime = _activationTime;
        userIDAccount.selfBusinessUSDOld = _totalTopUp;
        userIDAccount.referralPaidUSD = _limitBalanceUSD;
        userIDAccount.balanceClaimedUSD = _balanceClaimedUSD;
        userIDAccount.limitBalanceUSD = _limitBalanceUSD;
        userIDAccount.maxLimitAmount = _maxLimitUSD;

        if (isPayROI) {
            _activateROI(_userID, totalROIIDs, _totalTopUp, _activationTime);
        }

        for (uint8 i; i < _maxLevelsCount; i++) {
            uint32 refererID = userIDAccount.refererID;
            StructID storage refererIDAccount = ids[refererID];
            if (refererIDAccount.id == 0) {
                break;
            }

            if (i == 0) {
                refererIDAccount.directBusinessUSDOld += _totalTopUp;
            }

            refererIDAccount.teamBusinessUSDOld += _totalTopUp;
            refererIDAccount.teamIDs.push(_userID);

            userIDAccount = refererIDAccount;
        }
    }

    function updateIDOldIDtoAddress(
        uint32[] calldata _userID,
        address[] calldata _userAddress,
        string[] memory _oldID
    ) external onlyOwner {
        for (uint16 i; i < _userID.length; i++) {
            StructID storage userIDAccount = ids[_userID[i]];
            StructAccount storage userAccount = accounts[_userAddress[i]];

            userIDAccount.id = _userID[i];
            userIDAccount.oldID = _oldID[i];
            userAccount.accountIDs.push(_userID[i]);
            userIDAccount.owner = _userAddress[i];
        }
    }

    function updateUserIDDataOldAdmin(
        uint32[] calldata _userID,
        uint256[] calldata _totalTopUp,
        uint256[] calldata _limitBalanceUSD,
        uint256[] calldata _balanceClaimedUSD,
        uint256[] calldata _joiningTime,
        uint256[] calldata _activationTime
    ) external onlyOwner {
        for (uint256 i; i < _userID.length; i++) {
            totalROIIDs++;
            if (_totalTopUp[i] > 0) {
                uint256 _maxLimitUSD = _totalTopUp[i] * 3;
                _updateOldIDData(
                    _userID[i],
                    _totalTopUp[i],
                    _limitBalanceUSD[i],
                    _maxLimitUSD,
                    _balanceClaimedUSD[i],
                    _joiningTime[i],
                    _activationTime[i]
                );
            }
        }
    }

    function _updateUserIDTopUp(
        uint32 _id,
        uint32 roiID,
        uint256 _valueInUSD,
        uint256 _valueInWei,
        uint256 _currenTime
    ) private {
        uint256 _maxLevelsCount = maxLevelsCount;

        StructID storage userIDAccount = ids[_id];
        StructID storage zeroIDAccount = ids[0];

        userIDAccount.roiIDs.push(roiID);
        userIDAccount.maxLimitAmount = _valueInUSD * 2;
        userIDAccount.selfBusinessUSD += _valueInWei;

        zeroIDAccount.teamBusinessUSD += _valueInUSD;

        zeroIDAccount.teamIDs.push(_id);

        for (uint256 i; i < _maxLevelsCount; i++) {
            uint32 refererID = userIDAccount.refererID;
            StructID storage refererIDAccount = ids[refererID];
            if (refererIDAccount.owner == address(0)) {
                break;
            }

            if (i == 0) {
                refererIDAccount.directBusinessUSD += _valueInUSD;
            }

            refererIDAccount.teamBusinessUSD += _valueInUSD;

            if (
                _getIDRoyalyClubLevel(refererID) >
                refererIDAccount.royaltyClubPackageID
            ) {
                refererIDAccount.royaltyClubPackageID = _getIDRoyalyClubLevel(
                    refererID
                );

                packages[refererIDAccount.royaltyClubPackageID]
                    .achieversList
                    .push(refererID);

                refererIDAccount.royaltyClubListIndex =
                    packages[refererIDAccount.royaltyClubPackageID]
                        .achieversList
                        .length -
                    1;

                emit AddedInRoyaltyClubList(
                    refererID,
                    refererIDAccount.royaltyClubListIndex,
                    refererIDAccount.royaltyClubPackageID
                );

                if (
                    packages[_getIDRoyalyClubLevel(refererID)].isPayReccursive
                ) {
                    if (
                        _currenTime >
                        refererIDAccount.timeStampRoyaltyClub +
                            packages[_getIDRoyalyClubLevel(refererID)].timeLimit
                    ) {
                        refererIDAccount.timeStampRoyaltyClub = _currenTime;
                        refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
                    } else {
                        refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
                    }
                } else {
                    if (isPayRoyaltyClubBonus) {
                        _increaseIDLimitBalance(
                            refererIDAccount,
                            packages[refererIDAccount.royaltyClubPackageID]
                                .reward
                        );

                        zeroIDAccount.referralPaidUSD += packages[
                            refererIDAccount.royaltyClubPackageID
                        ].reward;

                        emit RoyaltyClubBonusPaid(
                            packages[refererIDAccount.royaltyClubPackageID]
                                .packageID,
                            refererID,
                            packages[refererIDAccount.royaltyClubPackageID]
                                .reward
                        );
                    }
                }
            }

            if (
                _currenTime >
                companyTurnoverTimeStamp + companyTurnoverTimeLimit
            ) {
                companyTurnoverTimeStamp = _currenTime;
                companyTurnoverWithTimeLimit = _valueInUSD;
            } else {
                companyTurnoverWithTimeLimit += _valueInUSD;
            }

            refererID = refererIDAccount.refererID;
        }

        totalIDs++;
    }

    function _payReferal(uint256 _valueInUSD, uint32 _id) private {
        uint16[] memory rates = levelRates;
        uint256 ratesCount = rates.length;
        StructID storage userAccountID = ids[_id];
        StructID storage zeroIDAccount = ids[0];

        uint256 totalReferralInUSD;

        for (uint256 i; i < ratesCount; i++) {
            uint32 refererID = userAccountID.refererID;
            StructID storage refererIDAccount = ids[refererID];
            if (refererIDAccount.owner == address(0)) {
                break;
            }

            if (refererIDAccount.isDisabled) {
                emit ReferralNotPaid(refererID, i + 1, "Referer is Inactive");
                refererID = refererIDAccount.refererID;
                continue;
            } else if (
                refererIDAccount.limitBalanceUSD >=
                refererIDAccount.maxLimitAmount
            ) {
                emit ReferralNotPaid(
                    refererID,
                    i + 1,
                    "Reached the limit. Referer is Inactive. "
                );

                _disableID(refererIDAccount);

                emit IDDeactivated(refererIDAccount.id);

                refererID = refererIDAccount.refererID;
                continue;
            }

            if (i + 1 > _userLevelUnlockCount(refererIDAccount)) {
                emit ReferralNotPaid(
                    refererID,
                    i + 1,
                    "Downline levels limit reached"
                );

                refererID = refererIDAccount.refererID;

                continue;
            }

            uint256 c = (_valueInUSD * rates[i]) / decimals;

            refererIDAccount.referralPaidUSD += (c);

            _increaseIDLimitBalance(refererIDAccount, c);

            totalReferralInUSD += c;

            emit ReferralRewardPaid(_id, refererID, c, i + 1);

            refererID = refererIDAccount.refererID;
        }

        zeroIDAccount.referralPaidUSD += totalReferralInUSD;
    }

    function _activateROI(
        uint32 _id,
        uint32 roiID,
        uint256 _valueInUSD,
        uint256 _currentTime
    ) private {
        StructROI storage roiAccount = rois[roiID];
        StructID storage userIDAccount = ids[_id];
        StructID storage zeroIDAccount = ids[0];

        roiAccount.isActive = true;
        roiAccount.ownerID = _id;
        roiAccount.valueInUSD = _valueInUSD;

        roiAccount.roiRate = _roiRate;
        roiAccount.startTime = _currentTime;
        roiAccount.duration = _roiDuration;

        userIDAccount.roiIDs.push(roiID);
        zeroIDAccount.roiIDs.push(roiID);

        totalROIIDs++;
    }

    function _getROI(uint32 roiID) private view returns (uint256 roi) {
        StructROI storage roiAccount = rois[roiID];
        if (roiAccount.isActive) {
            uint256 _currentTime = block.timestamp;
            uint256 baseReward = (roiAccount.valueInUSD * _roiRate) /
                decimals /
                _roiDuration;

            uint256 _timePassed = _currentTime - roiAccount.startTime;

            roi =
                (baseReward * _min(_timePassed, roiAccount.duration)) -
                roiAccount.roiClaimed;
        } else {
            roi = 0;
        }
    }

    function _getROIALL(uint32 _id) private view returns (uint256 totalROI) {
        uint32[] memory roiIDs = ids[_id].roiIDs;
        uint256 roiIDsCount = roiIDs.length;

        for (uint16 i; i < roiIDsCount; i++) {
            totalROI += _getROI(roiIDs[i]);
        }
    }

    function getUserIDROI(uint32 _id) external view returns (uint256 roi) {
        StructID storage userIDAccount = ids[_id];
        uint256 _roiReward = _getROIALL(_id);
        if (
            userIDAccount.limitBalanceUSD + _roiReward <=
            userIDAccount.maxLimitAmount
        ) {
            roi = _roiReward;
        } else {
            uint256 _limitDifference = userIDAccount.maxLimitAmount -
                userIDAccount.limitBalanceUSD;

            roi = _limitDifference;
        }
    }

    function _claimROI(uint32 _id) private returns (uint256 roiClaimed) {
        StructID storage zeroIDAccount = ids[0];
        StructID storage userIDAccount = ids[_id];
        uint32[] memory roiIDs = userIDAccount.roiIDs;

        // require(
        //     msg.sender == userIDAccount.owner,
        //     "You are not owner of this id."
        // );

        // require(
        //     block.timestamp >=
        //         userIDAccount.roiClaimTimestamp + _roiClaimTimelimit,
        //     "You roi claim timelimit is not over yeh"
        // );

        uint256 _totalROIReward;

        for (uint256 i; i < roiIDs.length; i++) {
            StructROI storage roiIDAccount = rois[roiIDs[i]];
            _totalROIReward += _getROI(roiIDs[i]);
            roiIDAccount.roiClaimed += _getROI(roiIDs[i]);
        }

        if (
            userIDAccount.limitBalanceUSD + _totalROIReward <=
            userIDAccount.maxLimitAmount
        ) {
            userIDAccount.limitBalanceUSD += _totalROIReward;
            userIDAccount.roiClaimedUSD += _totalROIReward;

            userIDAccount.roiClaimTimestamp = block.timestamp;
            zeroIDAccount.limitBalanceUSD += _totalROIReward;
            roiClaimed = _totalROIReward;
            emit ROIClaimed(_id, _totalROIReward);
        } else {
            uint256 _limitDifference = userIDAccount.maxLimitAmount -
                userIDAccount.limitBalanceUSD;
            emit ROIClaimed(_id, _limitDifference);
            userIDAccount.limitBalanceUSD = userIDAccount.maxLimitAmount;
            userIDAccount.roiClaimedUSD += _limitDifference;

            userIDAccount.roiClaimTimestamp = block.timestamp;
            zeroIDAccount.limitBalanceUSD += _limitDifference;
            roiClaimed = _limitDifference;

            _disableIDROIs(userIDAccount);
        }
    }

    function claimROI(uint32 _id) external {
        uint256 roiClaimed = _claimROI(_id);
        _payReferal(roiClaimed, _id);
    }

    function topUpID(uint32 _id) external payable {
        uint256 _valueInWei = msg.value;

        require(
            _valueInWei >= _usdToETH(minContributionInUSD),
            "Value should be greate then minContribution"
        );

        address _msgSender = msg.sender;
        uint256 _valueInUSD = _ethToUSD(_valueInWei);
        uint256 _currenTime = block.timestamp;
        uint32 roiID = totalROIIDs + 1;

        StructID storage userIDAccount = ids[_id];

        require(
            userIDAccount.owner == _msgSender,
            "You are not owner of this id."
        );

        if (isPayROI) {
            _activateROI(_id, roiID, _valueInUSD, _currenTime);
        }
    }

    function _userLevelUnlockCount(
        StructID memory _userIDAccount
    ) private view returns (uint256) {
        uint256 userRefereeCount = _userIDAccount.refereeIDs.length;
        uint256 count;

        if (userRefereeCount > 0) {
            count = userRefereeCount * _userLevelUnlockMultiplier - 1;
        }

        return count;
    }

    function getUserUnlockCount(uint32 _id) external view returns (uint256) {
        StructID memory idAccount = ids[_id];
        return _userLevelUnlockCount(idAccount);
    }

    function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
        uint256 value = (_valueInUSD * 10 ** 18) /
            IPriceOracle(_priceOracleContract).getPriceInUSD();
        return value;
    }

    function _ethToUSD(uint256 _valueInWei) private view returns (uint256) {
        uint256 value = (_valueInWei *
            IPriceOracle(_priceOracleContract).getPriceInUSD()) / 10 ** 18;
        return value;
    }

    function isUserDisabledByAdmin(
        address _userAddress
    ) external view returns (bool) {
        return accounts[_userAddress].isDisabled;
    }

    function disableUserAdmin(address _userAddress) external onlyOwner {
        _disabledUsersList.push(_userAddress);
        accounts[_userAddress].isDisabled = true;
    }

    function removeUserFromDisableList(
        address _userAddress
    ) external onlyOwner {
        accounts[_userAddress].isDisabled = false;
        uint256 disabledUsersLength = _disabledUsersList.length;

        for (uint256 i; i < disabledUsersLength; i++) {
            if (_disabledUsersList[i] == _userAddress) {
                _disabledUsersList[i] = _disabledUsersList[
                    disabledUsersLength - 1
                ];

                _disabledUsersList.pop();
            }
        }
    }

    function _inMultipleOf(
        uint256 _valueInUSD,
        uint256 _division
    ) private pure returns (uint256) {
        if (_valueInUSD < 10 * 10 ** 18) {
            return 0;
        }

        uint256 vad = (_valueInUSD / 10 ** 18) / _division;
        return vad * 10 ** 18;
    }

    function isInMultipleOf(
        uint256 _valueInUSD,
        uint256 _division
    ) private pure returns (bool) {
        if (_valueInUSD < 10 * 10 ** 18) {
            return false;
        }

        uint256 vad = (_valueInUSD / 10 ** 18) / _division;
        return vad * _division * 10 ** 18 == _valueInUSD ? true : false;
    }

    function getPriceOracleContract() external view returns (address) {
        return _priceOracleContract;
    }

    function setPriceOracleContract(
        address _contractAddress
    ) external onlyOwner {
        _priceOracleContract = _contractAddress;
    }

    function getIDClaimableBalance(uint32 _id) external view returns (uint256) {
        StructID memory id = ids[_id];
        return id.limitBalanceUSD - id.balanceClaimedUSD;
    }

    function claimBalance(uint32 _id, uint256 _valueInUSD) external {
        StructID storage idAccount = ids[_id];
        require(!idAccount.isDisabled, "ID is not active");
        require(idAccount.owner == msg.sender, "You are not owner of this id.");
        uint256 userLimitBalance = _idLimitBalance(idAccount);
        uint256 userTotalWithdrawUSD = idAccount.balanceClaimedUSD;
        require(
            _valueInUSD <= userLimitBalance - userTotalWithdrawUSD,
            "Please enter value less then your balance."
        );

        idAccount.balanceClaimedUSD += _valueInUSD;
        payable(msg.sender).transfer(_valueInUSD);

        if (_idLimitBalance(idAccount) >= idAccount.maxLimitAmount) {}
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        if (x > y) {
            return y;
        }

        return x;
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
