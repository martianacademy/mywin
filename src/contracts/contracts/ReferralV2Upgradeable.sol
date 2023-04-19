// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint);
}

interface IPriceOracle {
    function getPriceInUSD() external view returns (uint256);
}

contract ReferralV2Upgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;
    address private _priceOracleContract;

    uint16[] private _levelRates;
    uint16 private _decimals;

    uint8 private _levelsToCounts;

    uint256 private _minContributionInUSD;

    uint256 private _totalRoyaltyClubBonusPaidUSD;
    uint256 private _totalRoyaltyClubBonusPaidETH;

    uint24 private _totalUsers;
    uint24 private _totalIDs;
    uint24 private _totalROIIDs;

    uint16 private _roiRate;
    uint256 private _roiDuration;
    uint256 private _roiClaimTimelimit;

    bool private _isPayROI;
    bool private _isPayRoyaltyClubBonus;
    uint8 private _royaltyClubPackageCount;

    uint8 private _userLevelUnlockMultiplier;

    uint256 private _companyTurnoverWithTimeLimit;
    uint256 private _companyTurnoverTimeStamp;
    uint256 private _companyTurnoverTimeLimit;

    address[] private _disabledUsersList;

    struct Account {
        bool isDisabled;
        uint24[] accountInfoArray;
    }

    struct AccountInfo {
        uint24 id;
        bool isDisabled;
        address owner;
        uint256 activationTime;
        uint24[] roiIDs;
        uint24 refererID;
        uint24[] refereeIDs;
        uint24[] teamIDs;
        uint256[] selfBusinessUSDArray;
        uint256 selfBusinessUSD;
        uint256 directBusinessUSD;
        uint256 teamBusinessUSD;
        uint256 royaltyClubBusinessUSD;
        uint256 timeStampRoyaltyClub;
        uint8 royaltyClubPackageID;
        uint256 royaltyClubListIndex;
        uint256 referralPaidUSD;
        uint256 rewardPaidRoyaltyClubUSD;
        uint256 fundsToActivateIDUSD;
        uint256 balanceClaimedUSD;
        uint256 limitBalanceUSD;
        uint256 maxLimitAmount;
        uint256 roiClaimedUSD;
        uint256 roiClaimTimestamp;
    }

    struct ROIInfo {
        bool isActive;
        uint24 ownerID;
        uint256 valueInUSD;
        uint16 roiRate;
        uint256 startTime;
        uint256 duration;
        uint256 roiClaimed;
    }

    struct Packages {
        uint8 packageID;
        uint256 selfBusinessUSD;
        uint256 directBusinessUSD;
        uint256 teamBusinessUSD;
        string rankName;
        uint256 reward;
        uint256 businessLimit;
        uint256 timeLimit;
        bool isPayReccursive;
        uint24[] achieversList;
    }

    uint256 public packagesCount;

    mapping(address => Account) private accounts;
    mapping(uint24 => AccountInfo) private accountInfoID;
    mapping(uint24 => ROIInfo) private roiInfo;
    mapping(uint8 => Packages) private packages;

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

    event RemovedFromRoyaltyClubList(
        address indexed userAddress,
        string indexed lastRankName
    );

    event ReferralNotPaid(
        uint256 indexed refererID,
        uint256 indexed level,
        string indexed reason
    );

    event PackageAdded(uint256 packageID);

    event PackageUpdated(uint256 packageID);

    event PackageRemoved(uint256 packageID);

    event ROIActivated(
        address indexed userAddress,
        uint256 indexed valueinUSD,
        uint256 duration,
        uint256 roiID
    );
    event ROIClaimed(uint256 indexed userID, uint256 indexed reward);

    function initialize() public initializer {
        _priceOracleContract = 0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168;

        _decimals = 1000;
        _levelRates = [
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

        _levelsToCounts = 50;

        _minContributionInUSD = 1000000000000000000;

        _userLevelUnlockMultiplier = 2;

        _isPayRoyaltyClubBonus = true;

        _isPayROI = true;

        _roiRate = 1000;
        _roiDuration = 400 days;
        _roiClaimTimelimit = 20;

        _companyTurnoverTimeLimit = 30 days;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {}

    function getUserAccount(
        address _address
    ) external view returns (Account memory) {
        return accounts[_address];
    }

    function getIDAccount(
        uint24 _id
    ) external view returns (AccountInfo memory) {
        return accountInfoID[_id];
    }

    function getLevelDecimals() external view returns (uint256) {
        return _decimals;
    }

    function getLevelsToCount() external view returns (uint256) {
        return _levelsToCounts;
    }

    function setLevelsToCount(uint8 _valueInDecimals) external onlyOwner {
        _levelsToCounts = _valueInDecimals;
    }

    function setLevelDecimals(uint16 _value) external onlyOwner {
        _decimals = _value;
    }

    function getLevelRates()
        external
        view
        returns (uint16[] memory presale, uint256 totalRatePresale)
    {
        presale = _levelRates;
        uint256 presaleRateLength = presale.length;
        for (uint8 i; i < presaleRateLength; i++) {
            totalRatePresale += presale[i];
        }
    }

    function setLevelRateReferral(uint8[] calldata _value) external onlyOwner {
        _levelRates = _value;
    }

    function _getIDRoyalyClubLevel(
        uint24 _id
    ) private view returns (uint8 prevCount) {
        AccountInfo memory accountInfo = accountInfoID[_id];
        uint256 _royaltyPackagesCount = packagesCount;

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

    function getIDRoyaltyClubLevel(uint24 _id) public view returns (uint256) {
        return _getIDRoyalyClubLevel(_id);
    }

    function getRoyaltyClubPackageInfo(
        uint8 _packageID
    ) external view returns (Packages memory) {
        return packages[_packageID];
    }

    function getAchieversList(
        uint8 _packageID
    ) external view returns (uint24[] memory) {
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
        Packages storage package = packages[packageID];
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

    function getRoyaltyClubPackageCount() external view returns (uint256) {
        return packagesCount;
    }

    function setRoyaltyPackageCount(
        uint256 _valueInDecimals
    ) external onlyOwner {
        packagesCount = _valueInDecimals;
    }

    function payRoyaltyClubReccursiveBonusAdmin() external onlyOwner {
        uint256 _royaltyPackagesCount = packagesCount;
        AccountInfo storage zeroIDAccount = accountInfoID[0];

        for (uint8 i; i < _royaltyPackagesCount; i++) {
            Packages memory package = packages[i];
            if (!package.isPayReccursive) {
                continue;
            }

            uint24[] memory acheiversList = package.achieversList;
            uint256 achieversCount = acheiversList.length;
            uint256 valueToDistribute = (_companyTurnoverWithTimeLimit *
                package.reward) /
                _decimals /
                achieversCount;

            for (uint256 j; j < achieversCount; j++) {
                AccountInfo storage userAccountInfoID = accountInfoID[
                    acheiversList[j]
                ];

                if (
                    userAccountInfoID.royaltyClubBusinessUSD >
                    package.businessLimit &&
                    userAccountInfoID.limitBalanceUSD <=
                    userAccountInfoID.maxLimitAmount
                ) {
                    userAccountInfoID.limitBalanceUSD += valueToDistribute;
                    zeroIDAccount.referralPaidUSD += valueToDistribute;

                    emit RoyaltyClubBonusPaid(
                        package.packageID,
                        acheiversList[j],
                        valueToDistribute
                    );
                }
            }
        }

        _companyTurnoverWithTimeLimit = 0;
        _companyTurnoverTimeStamp = block.timestamp;
    }

    function getIDReferrer(uint24 _id) external view returns (uint256) {
        return accountInfoID[_id].refererID;
    }

    function getIDReferee(
        uint24 _id
    ) external view returns (uint24[] memory referees, uint256 refereesCount) {
        AccountInfo storage id = accountInfoID[_id];
        referees = id.refereeIDs;
        refereesCount = referees.length;
    }

    function getIDTeam(
        uint24 _id
    ) external view returns (uint24[] memory team, uint256 teamCount) {
        AccountInfo storage id = accountInfoID[_id];
        team = id.teamIDs;
        teamCount = team.length;
    }

    function getIDRewardPaid(
        uint24 _id
    )
        external
        view
        returns (
            uint256 referralUSD,
            uint256 roiUSD,
            uint256 royaltyUSD,
            uint256 totalRewardPaid
        )
    {
        AccountInfo storage id = accountInfoID[_id];
        referralUSD = id.referralPaidUSD;
        roiUSD = id.roiClaimedUSD;
        royaltyUSD = id.rewardPaidRoyaltyClubUSD;
        totalRewardPaid = referralUSD + roiUSD + royaltyUSD;
    }

    function getIDTotalBusiness(
        uint24 _id
    )
        external
        view
        returns (
            uint256[] memory selfBusinessUSDArray,
            uint256 selfBusinessUSD,
            uint256 directBusinessUSD,
            uint256 teamBusinessUSD
        )
    {
        AccountInfo storage id = accountInfoID[_id];
        selfBusinessUSDArray = id.selfBusinessUSDArray;
        selfBusinessUSD = id.selfBusinessUSD;
        directBusinessUSD = id.directBusinessUSD;
        teamBusinessUSD = id.teamBusinessUSD;
    }

    function _addToTeam(uint24 _userID, uint24 _referrerID) private {
        uint256 levelsToCount = _levelsToCounts;
        for (uint256 i; i < levelsToCount; i++) {
            AccountInfo storage parentAccountID = accountInfoID[_referrerID];
            if (parentAccountID.owner == address(0)) {
                break;
            }

            parentAccountID.teamIDs.push(_userID);

            emit RegisteredTeamAddress(
                parentAccountID.owner,
                parentAccountID.id,
                _referrerID,
                _userID
            );

            _referrerID = parentAccountID.refererID;
        }
    }

    function _addReferrer(uint24 _id, uint24 _referrerID) private {
        accountInfoID[_id].refererID = _referrerID;
        accountInfoID[_referrerID].refereeIDs.push(_id);
        emit RegisteredReferer(_id, _referrerID);
    }

    function _idStatus(
        AccountInfo storage _idAccount
    ) private view returns (bool) {
        return
            _idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount
                ? false
                : true;
    }

    function _deactivateID(AccountInfo storage _idAccount) private {
        _idAccount.isDisabled = true;
        _idAccount.roiIDs = new uint24[](0);
        _disableIDROIs(_idAccount);
    }

    function _idLimitBalance(
        AccountInfo storage _idAccount
    ) private view returns (uint256) {
        return
            _idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount
                ? _idAccount.maxLimitAmount
                : _idAccount.limitBalanceUSD;
    }

    function _increaseIDLimitBalance(
        AccountInfo storage _idAccount,
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

    function _updateUserIDNewBusiness(
        uint24 _id,
        uint24 _refererID,
        uint24 roiID,
        address _owner,
        uint256 _valueInUSD,
        uint256 _currenTime
    ) private {
        uint8 levelsToCount = _levelsToCounts;

        AccountInfo storage userIDAccount = accountInfoID[_id];

        userIDAccount.owner = _owner;
        userIDAccount.refererID = _refererID;
        userIDAccount.roiIDs.push(roiID);
        userIDAccount.activationTime = _currenTime;
        userIDAccount.id = _id;
        userIDAccount.maxLimitAmount = _valueInUSD * 2;
        userIDAccount.selfBusinessUSD += _valueInUSD;
        userIDAccount.selfBusinessUSDArray.push(_valueInUSD);

        for (uint8 i; i < levelsToCount; i++) {
            uint24 refererID = userIDAccount.refererID;
            AccountInfo storage refererIDAccount = accountInfoID[refererID];
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
                    if (_isPayRoyaltyClubBonus) {
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
                _companyTurnoverTimeStamp + _companyTurnoverTimeLimit
            ) {
                _companyTurnoverTimeStamp = block.timestamp;
                _companyTurnoverWithTimeLimit = _valueInUSD;
            } else {
                _companyTurnoverWithTimeLimit += _valueInUSD;
            }

            userIDAccount = refererIDAccount;
        }

        _totalIDs++;
    }

    function activateID(uint24 _refererID) external payable whenNotPaused {
        uint256 _valueInWei = msg.value;
        uint256 _valueInUSD = _ethToUSD(_valueInWei);

        require(
            _valueInWei >= _usdToETH(_minContributionInUSD),
            "Value should be greate then 100"
        );

        address _msgSender = msg.sender;
        uint256 _currenTime = block.timestamp;
        uint24 _id = _totalIDs + 1;
        uint24 roiID = _totalROIIDs + 1;

        Account storage userAccount = accounts[_msgSender];

        _addReferrer(_id, _refererID);
        _addToTeam(_id, _refererID);

        if (_isPayROI) {
            _activateROI(_id, roiID, _valueInUSD, _currenTime);
        }

        _updateUserIDNewBusiness(
            _id,
            _refererID,
            roiID,
            _msgSender,
            _valueInUSD,
            _currenTime
        );

        userAccount.accountInfoArray.push(_id);
    }

    function _updateUserIDTopUp(
        uint24 _id,
        uint24 roiID,
        uint256 _valueInUSD,
        uint256 _valueInWei,
        uint256 _currenTime
    ) private {
        uint256 levelsToCount = _levelsToCounts;

        AccountInfo storage userIDAccount = accountInfoID[_id];
        AccountInfo storage zeroIDAccount = accountInfoID[0];

        userIDAccount.roiIDs.push(roiID);
        userIDAccount.maxLimitAmount = _valueInUSD * 2;
        userIDAccount.selfBusinessUSD += _valueInWei;

        userIDAccount.selfBusinessUSDArray.push(_valueInUSD);

        zeroIDAccount.teamBusinessUSD += _valueInUSD;

        zeroIDAccount.teamIDs.push(_id);

        for (uint256 i; i < levelsToCount; i++) {
            uint24 refererID = userIDAccount.refererID;
            AccountInfo storage refererIDAccount = accountInfoID[refererID];
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
                    if (_isPayRoyaltyClubBonus) {
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
                _companyTurnoverTimeStamp + _companyTurnoverTimeLimit
            ) {
                _companyTurnoverTimeStamp = _currenTime;
                _companyTurnoverWithTimeLimit = _valueInUSD;
            } else {
                _companyTurnoverWithTimeLimit += _valueInUSD;
            }

            refererID = refererIDAccount.refererID;
        }

        _totalIDs++;
    }

    function _payReferal(uint256 _valueInUSD, uint24 _id) private {
        uint16[] memory levelRates = _levelRates;
        uint256 levelRatesCount = _levelRates.length;
        AccountInfo storage userAccountID = accountInfoID[_id];
        AccountInfo storage zeroIDAccount = accountInfoID[0];

        uint256 totalReferralInUSD;

        for (uint256 i; i < levelRatesCount; i++) {
            uint24 refererID = userAccountID.refererID;
            AccountInfo storage refererIDAccount = accountInfoID[refererID];
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

                _deactivateID(refererIDAccount);

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

            uint256 c = _valueInUSD.mul(levelRates[i]).div(_decimals);

            refererIDAccount.referralPaidUSD += (c);

            _increaseIDLimitBalance(refererIDAccount, c);

            totalReferralInUSD += c;

            emit ReferralRewardPaid(_id, refererID, c, i + 1);

            refererID = refererIDAccount.refererID;
        }

        zeroIDAccount.referralPaidUSD += totalReferralInUSD;
    }

    function _activateROI(
        uint24 _id,
        uint24 roiID,
        uint256 _valueInUSD,
        uint256 _currentTime
    ) private {
        ROIInfo storage roiAccount = roiInfo[roiID];
        AccountInfo storage userIDAccount = accountInfoID[_id];
        AccountInfo storage zeroIDAccount = accountInfoID[0];

        roiAccount.isActive = true;
        roiAccount.ownerID = _id;
        roiAccount.valueInUSD = _valueInUSD;

        roiAccount.roiRate = _roiRate;
        roiAccount.startTime = _currentTime;
        roiAccount.duration = _roiDuration;

        userIDAccount.roiIDs.push(roiID);
        zeroIDAccount.roiIDs.push(roiID);

        _totalROIIDs++;
    }

    function _disableIDROIs(AccountInfo storage _idAccount) private {
        uint24[] memory idROIIDs = _idAccount.roiIDs;

        for (uint256 i; i < idROIIDs.length; i++) {
            roiInfo[idROIIDs[i]].isActive = false;
        }

        _idAccount.roiIDs = new uint24[](0);
    }

    function _getROI(uint24 roiID) private view returns (uint256 roi) {
        ROIInfo storage roiAccount = roiInfo[roiID];
        if (roiAccount.isActive) {
            uint256 _currentTime = block.timestamp;
            uint256 baseReward = (roiAccount.valueInUSD * _roiRate) /
                _decimals /
                _roiDuration;

            uint256 _timePassed = _currentTime - roiAccount.startTime;

            roi =
                (baseReward * _min(_timePassed, roiAccount.duration)) -
                roiAccount.roiClaimed;
        } else {
            roi = 0;
        }
    }

    function _getROIALL(uint24 _id) private view returns (uint256 totalROI) {
        uint24[] memory roiIDs = accountInfoID[_id].roiIDs;
        uint256 roiIDsCount = roiIDs.length;

        for (uint16 i; i < roiIDsCount; i++) {
            totalROI += _getROI(roiIDs[i]);
        }
    }

    function getUserIDROI(uint24 _id) external view returns (uint256 roi) {
        AccountInfo storage userIDAccount = accountInfoID[_id];
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

    function _claimROI(uint24 _id) private returns (uint256 roiClaimed) {
        AccountInfo storage zeroIDAccount = accountInfoID[0];
        AccountInfo storage userIDAccount = accountInfoID[_id];
        uint24[] memory roiIDs = userIDAccount.roiIDs;

        require(
            msg.sender == userIDAccount.owner,
            "You are not owner of this id."
        );

        require(
            block.timestamp >=
                userIDAccount.roiClaimTimestamp + _roiClaimTimelimit,
            "You roi claim timelimit is not over yeh"
        );

        uint256 _totalROIReward;

        for (uint256 i; i < roiIDs.length; i++) {
            ROIInfo storage roiIDAccount = roiInfo[roiIDs[i]];
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

    function claimROI(uint24 _id) external whenNotPaused {
        uint256 roiClaimed = _claimROI(_id);
        _payReferal(roiClaimed, _id);
    }

    function topUpID(uint24 _id) external payable whenNotPaused {
        uint256 _valueInWei = msg.value;

        require(
            _valueInWei >= _usdToETH(_minContributionInUSD),
            "Value should be greate then minContribution"
        );

        address _msgSender = msg.sender;
        uint256 _valueInUSD = _ethToUSD(_valueInWei);
        uint256 _currenTime = block.timestamp;
        uint24 roiID = _totalROIIDs + 1;

        AccountInfo storage userIDAccount = accountInfoID[_id];

        require(
            userIDAccount.owner == _msgSender,
            "You are not owner of this id."
        );

        if (_isPayROI) {
            _activateROI(_id, roiID, _valueInUSD, _currenTime);
        }
    }

    function _userLevelUnlockCount(
        AccountInfo memory _userIDAccount
    ) private view returns (uint256) {
        uint256 userRefereeCount = _userIDAccount.refereeIDs.length;
        uint256 count;

        if (userRefereeCount > 0) {
            count = userRefereeCount * _userLevelUnlockMultiplier - 1;
        }

        return count;
    }

    function getUserUnlockCount(uint24 _id) external view returns (uint256) {
        AccountInfo memory idAccount = accountInfoID[_id];
        return _userLevelUnlockCount(idAccount);
    }

    function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
        uint256 value = (_valueInUSD * 10 ** 18) /
            IPriceOracle(_priceOracleContract).getPriceInUSD();
        return value;
    }

    function getUSDToETH(uint256 _valueInUSD) external view returns (uint256) {
        return _usdToETH(_valueInUSD);
    }

    function _ethToUSD(uint256 _valueInWei) private view returns (uint256) {
        uint256 value = (_valueInWei *
            IPriceOracle(_priceOracleContract).getPriceInUSD()) / 10 ** 18;
        return value;
    }

    function getETHToUSD(uint256 _valueInWei) external view returns (uint256) {
        return _ethToUSD(_valueInWei);
    }

    function getDisabledUserList() external view returns (address[] memory) {
        return _disabledUsersList;
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

    function _addInRoyaltyClubList(address _userAddress) private {}

    function _userStatusRoyalyClub(address _userAddress) private {}

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

    function getIDClaimableBalance(uint24 _id) external view returns (uint256) {
        AccountInfo memory id = accountInfoID[_id];
        return id.limitBalanceUSD - id.balanceClaimedUSD;
    }

    function getIDLimitBalance(uint24 _id) external view returns (uint256) {
        return accountInfoID[_id].limitBalanceUSD;
    }

    function getIDMaxLimit(uint24 _id) external view returns (uint256) {
        return accountInfoID[_id].maxLimitAmount;
    }

    function claimBalance(uint24 _id, uint256 _valueInUSD) external {
        AccountInfo storage id = accountInfoID[_id];
        require(!id.isDisabled, "ID is not active");
        require(id.owner == msg.sender, "You are not owner of this id.");
        uint256 userLimitBalance = _idLimitBalance(id);
        uint256 userTotalWithdrawUSD = id.balanceClaimedUSD;
        require(
            _valueInUSD <= userLimitBalance - userTotalWithdrawUSD,
            "Please enter value less then your balance."
        );

        id.balanceClaimedUSD += _valueInUSD;

        payable(msg.sender).transfer(_valueInUSD);

        if (!_idStatus(id)) {
            _deactivateID(id);
        }
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

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
