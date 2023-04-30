// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.17;

// import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// interface IPriceOracle {
//     function getPriceInUSD() external view returns (uint256);
// }

// interface IFutureWallet {
//     function stakeByAdmin(address _userAddress, uint256 _value) external;
// }

// contract ReferralV2Upgradeable is
//     Initializable,
//     OwnableUpgradeable,
//     UUPSUpgradeable
// {
//     address private _priceOracleContract;

//     uint16[] public levelRates;
//     uint16 public decimals;

//     uint8 public maxLevelsCount;

//     uint256 public minContributionInUSD;

//     uint256 public totalRoyaltyClubBonusPaidUSD;
//     uint256 public totalRoyaltyClubBonusPaidETH;
//     uint256 public totalReferralPaidUSD;
//     uint256 public totalROIPaidUSD;

//     uint32 public totalUsers;
//     uint32 public totalIDs;
//     uint32 public totalROIIDs;

//     uint16 private _roiRate;
//     uint256 private _roiDuration;
//     uint256 private _roiClaimTimelimit;

//     bool public isPayROI;
//     bool public isPayRoyaltyClubBonus;
//     uint8 public royaltyClubPackageCount;

//     uint8 private _userLevelUnlockMultiplier;

//     uint256 public companyTurnoverWithTimeLimit;
//     uint256 public companyTurnoverTimeStamp;
//     uint256 public companyTurnoverTimeLimit;

//     address[] public _disabledUsersList;

//     struct StructAccount {
//         bool isDisabled;
//         uint32[] accountIDs;
//     }

//     struct StructID {
//         uint32 id;
//         string oldID;
//         bool isDisabled;
//         address owner;
//         uint256 joiningTime;
//         uint256 activationTime;
//         uint256 deactivateTime;
//         uint32[] roiIDs;
//         uint32 refererID;
//         uint32[] refereeIDs;
//         uint32[] teamIDs;
//         uint32[] teamLevel;
//         uint256 selfBusinessUSD;
//         uint256 selfBusinessUSDOld;
//         uint256 directBusinessUSD;
//         uint256 directBusinessUSDOld;
//         uint256 teamBusinessUSD;
//         uint256 teamBusinessUSDOld;
//         uint256 royaltyClubBusinessUSD;
//         uint256 timeStampRoyaltyClub;
//         uint8 royaltyClubPackageID;
//         uint256 royaltyClubListIndex;
//         uint256 referralPaidUSD;
//         uint256 rewardPaidRoyaltyClubUSD;
//         uint256 topUpUSD;
//         uint256 balanceClaimedUSD;
//         uint256 limitBalanceUSD;
//         uint256 maxLimitAmount;
//         uint256 totalROIClaimedUSD;
//         uint256 roiClaimedUSD;
//         uint256 roiClaimTimestamp;
//     }

//     struct StructROI {
//         bool isActive;
//         uint32 ownerID;
//         uint256 valueInUSD;
//         uint16 roiRate;
//         uint256 startTime;
//         uint256 duration;
//     }

//     struct StructPackages {
//         uint8 packageID;
//         uint256 selfBusinessUSD;
//         uint256 directBusinessUSD;
//         uint256 teamBusinessUSD;
//         string rankName;
//         uint256 reward;
//         uint256 businessLimit;
//         uint256 timeLimit;
//         bool isOneTimeRewardPaid;
//         bool isPayReccursive;
//         uint32[] achieversList;
//     }

//     uint8 public packagesCount;

//     mapping(address => StructAccount) private accounts;
//     mapping(uint32 => StructID) private ids;
//     mapping(uint32 => StructROI) private rois;
//     mapping(uint8 => StructPackages) private packages;

//     event IDDeactivated(uint256 id, string reason);

//     event AccountInfoIDAttached(
//         address ownerAddress,
//         uint256 id,
//         uint256 idIndex
//     );

//     event RegisteredReferer(uint256 indexed id, uint256 indexed refererID);

//     event RegisteredTeamAddress(
//         address indexed parent,
//         uint256 parentAccountID,
//         uint256 indexed referrerID,
//         uint256 indexed refereeID
//     );

//     event RegisterRefererFailed(
//         address indexed refereeID,
//         address indexed referrerID,
//         string indexed reason
//     );

//     event ReferralRewardPaid(
//         uint256 indexed refereeID,
//         uint256 indexed referrerID,
//         uint256 indexed amount,
//         uint256 level
//     );

//     event AddedInRoyaltyClubList(uint256 userID, uint256 index, uint256 rank);

//     event RoyaltyClubBonusPaid(
//         uint256 packageID,
//         uint256 indexed userID,
//         uint256 indexed amount
//     );

//     event ReferralNotPaid(
//         uint256 indexed refererID,
//         uint256 indexed level,
//         string indexed reason
//     );

//     event PackageAdded(uint256 packageID);

//     event PackageUpdated(uint256 packageID);

//     event PackageRemoved(uint256 packageID);

//     event ROIClaimed(uint256 indexed userID, uint256 indexed reward);

//     function initialize() public initializer {
//         _priceOracleContract = 0x286d6392042B4D7180Fd6d20F8D35c8776815774;

//         decimals = 1000;
//         levelRates = [
//             100,
//             70,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             50,
//             20,
//             20,
//             20,
//             20,
//             20,
//             20,
//             20,
//             20,
//             20,
//             20
//         ];

//         maxLevelsCount = 50;

//         minContributionInUSD = 1000000000000000000;

//         _userLevelUnlockMultiplier = 2;

//         isPayRoyaltyClubBonus = false;

//         isPayROI = true;

//         _roiRate = 1000;
//         _roiDuration = 200 days;
//         _roiClaimTimelimit = 1 days;

//         companyTurnoverTimeLimit = 30 days;

//         __Ownable_init();
//         __UUPSUpgradeable_init();
//     }

//     address[] public admins;

//     modifier onlyAdmin() {
//         for (uint8 i; i < admins.length; i++) {
//             if (msg.sender == admins[i]) {
//                 _;
//                 break;
//             } else if (i == admins.length - 1) {
//                 require(msg.sender == admins[i], "You are not admin");
//             }
//         }
//     }

//     receive() external payable {}

//     function setAdmin(address _adminAddress) external onlyOwner {
//         admins.push(_adminAddress);
//     }

//     function getUserAccount(
//         address _address
//     ) external view returns (StructAccount memory) {
//         return accounts[_address];
//     }

//     function getIDAccount(uint32 _id) external view returns (StructID memory) {
//         return ids[_id];
//     }

//     function getROIAccount(
//         uint32 _roiID
//     ) external view returns (StructROI memory) {
//         return rois[_roiID];
//     }

//     // function setMaxLevelsCountAdmin(uint8 _valueInDecimals) external onlyOwner {
//     //     maxLevelsCount = _valueInDecimals;
//     // }

//     // function setLevelDecimals(uint16 _value) external onlyOwner {
//     //     decimals = _value;
//     // }

//     // function setLevelRates(uint8[] calldata _value) external onlyOwner {
//     //     levelRates = _value;
//     // }

//     // function getRoyaltyClubPackageInfo(
//     //     uint8 _packageID
//     // ) external view returns (StructPackages memory) {
//     //     return packages[_packageID];
//     // }

//     // function getAchieversList(
//     //     uint8 _packageID
//     // ) external view returns (uint32[] memory) {
//     //     return packages[_packageID].achieversList;
//     // }

//     // function setRoyaltyClubPackage(
//     //     uint8 packageID,
//     //     uint256 selfBusinessUSD,
//     //     uint256 directBusinessUSD,
//     //     uint256 teamBusinessUSD,
//     //     string memory rankName,
//     //     uint256 reward,
//     //     uint256 businessLimit,
//     //     uint256 timeLimit,
//     //     bool isPayReccursive
//     // ) external onlyOwner {
//     //     StructPackages storage package = packages[packageID];
//     //     package.packageID = packageID;
//     //     package.selfBusinessUSD = selfBusinessUSD;
//     //     package.directBusinessUSD = directBusinessUSD;
//     //     package.teamBusinessUSD = teamBusinessUSD;
//     //     package.rankName = rankName;
//     //     package.reward = reward;
//     //     package.businessLimit = businessLimit;
//     //     package.timeLimit = timeLimit;
//     //     package.isPayReccursive = isPayReccursive;

//     //     emit PackageAdded(packageID);
//     // }

//     // function setRoyaltyPackageCount(uint8 _valueInDecimals) external onlyOwner {
//     //     packagesCount = _valueInDecimals;
//     // }

//     // function payRoyaltyClubReccursiveBonusAdmin() external onlyOwner {
//     //     uint8 _royaltyPackagesCount = packagesCount;

//     //     for (uint8 i; i < _royaltyPackagesCount; i++) {
//     //         StructPackages memory package = packages[i];
//     //         if (!package.isPayReccursive) {
//     //             continue;
//     //         }

//     //         uint32[] memory acheiversList = package.achieversList;
//     //         uint32 achieversCount = uint32(acheiversList.length);
//     //         uint256 valueToDistribute = (companyTurnoverWithTimeLimit *
//     //             package.reward) /
//     //             decimals /
//     //             achieversCount;

//     //         for (uint32 j; j < achieversCount; j++) {
//     //             StructID storage userAccountInfoID = ids[acheiversList[j]];

//     //             if (
//     //                 userAccountInfoID.royaltyClubBusinessUSD >
//     //                 package.businessLimit &&
//     //                 userAccountInfoID.limitBalanceUSD <=
//     //                 userAccountInfoID.maxLimitAmount
//     //             ) {
//     //                 userAccountInfoID.limitBalanceUSD += valueToDistribute;

//     //                 emit RoyaltyClubBonusPaid(
//     //                     package.packageID,
//     //                     acheiversList[j],
//     //                     valueToDistribute
//     //                 );
//     //             }
//     //         }
//     //     }

//     //     companyTurnoverWithTimeLimit = 0;
//     //     companyTurnoverTimeStamp = block.timestamp;
//     // }

//     function addTeamAddress(uint32[] calldata _userID) external onlyAdmin {
//         for (uint32 i; i < _userID.length; i++) {
//             StructID storage userIDAccount = ids[_userID[i]];
//             uint8 _maxLevelCount = maxLevelsCount;

//             for (uint32 j; j < _maxLevelCount; j++) {
//                 uint32 _referrerID = userIDAccount.refererID;
//                 StructID storage referrerIDAccount = ids[_referrerID];
//                 if (j == 0) {
//                     referrerIDAccount.refereeIDs.push(_userID[i]);
//                 }

//                 if (userIDAccount.id == 0) {
//                     break;
//                 }

//                 referrerIDAccount.teamIDs.push(_userID[i]);
//                 referrerIDAccount.teamLevel.push(j + 1);

//                 emit RegisteredTeamAddress(
//                     referrerIDAccount.owner,
//                     referrerIDAccount.id,
//                     _referrerID,
//                     _userID[i]
//                 );

//                 userIDAccount = referrerIDAccount;
//             }
//         }
//     }

//     function removeRefereeArray(uint32[] calldata _userID) external onlyAdmin {
//         for (uint32 i; i < _userID.length; i++) {
//             StructID storage IDAccount = ids[_userID[i]];
//             IDAccount.refereeIDs = new uint32[](0);
//         }
//     }

//     // function _addReferrer(uint32 _userID, uint32 _referrerID) private {
//     //     StructID storage userIDAccount = ids[_userID];
//     //     userIDAccount.refererID = _referrerID;
//     //     emit RegisteredReferer(_userID, _referrerID);

//     //     uint8 _maxLevelCount = maxLevelsCount;

//     //     for (uint256 i; i < _maxLevelCount; i++) {
//     //         StructID storage referrerIDAccount = ids[userIDAccount.refererID];
//     //         if (i == 0) {
//     //             referrerIDAccount.refereeIDs.push(_userID);
//     //         }

//     //         if (userIDAccount.id == 0) {
//     //             break;
//     //         }

//     //         referrerIDAccount.teamIDs.push(_userID);

//     //         emit RegisteredTeamAddress(
//     //             referrerIDAccount.owner,
//     //             userIDAccount.refererID,
//     //             _referrerID,
//     //             _userID
//     //         );

//     //         userIDAccount = referrerIDAccount;
//     //     }
//     // }

//     function _checkIfIDDisabled(
//         StructID storage _idAccount
//     ) private view returns (bool) {
//         if (_idAccount.isDisabled) {
//             return true;
//         } else if (_idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount) {
//             return true;
//         } else if (_idAccount.roiIDs.length > 0) {
//             StructROI storage roiAccount = rois[
//                 _idAccount.roiIDs[_idAccount.roiIDs.length - 1]
//             ];

//             if (roiAccount.startTime + roiAccount.duration >= block.timestamp) {
//                 return true;
//             }
//         }

//         return false;
//     }

//     function _disableID(StructID storage _idAccount) private {
//         _idAccount.isDisabled = true;
//         _idAccount.roiIDs = new uint32[](0);
//         _idAccount.roiClaimedUSD = 0;
//     }

//     function _idLimitBalance(
//         StructID storage _idAccount
//     ) private view returns (uint256) {
//         return
//             _idAccount.limitBalanceUSD >= _idAccount.maxLimitAmount
//                 ? _idAccount.maxLimitAmount
//                 : _idAccount.limitBalanceUSD;
//     }

//     function _increaseIDLimitBalance(
//         StructID storage _idAccount,
//         uint256 _valueInUSD
//     ) private {
//         if (
//             _idAccount.limitBalanceUSD + _valueInUSD >=
//             _idAccount.maxLimitAmount
//         ) {
//             _idAccount.limitBalanceUSD = _idAccount.maxLimitAmount;
//         } else {
//             _idAccount.limitBalanceUSD + _valueInUSD;
//         }
//     }

//     function _updateCompanyTurnOver(
//         uint256 _valueInUSD,
//         uint256 _currenTime
//     ) private {
//         if (_currenTime > companyTurnoverTimeStamp + companyTurnoverTimeLimit) {
//             companyTurnoverTimeStamp = _currenTime;
//             companyTurnoverWithTimeLimit = _valueInUSD;
//         } else {
//             companyTurnoverWithTimeLimit += _valueInUSD;
//         }
//     }

//     function _getIDRoyalyClubLevel(
//         StructID memory idAccount
//     ) private view returns (uint8 prevCount) {
//         uint8 _royaltyPackagesCount = packagesCount;

//         for (uint8 i; i < _royaltyPackagesCount; i++) {
//             if (
//                 idAccount.selfBusinessUSD >= packages[i].selfBusinessUSD &&
//                 idAccount.directBusinessUSD >= packages[i].directBusinessUSD &&
//                 idAccount.teamBusinessUSD >= packages[i].teamBusinessUSD
//             ) {
//                 prevCount = uint8(i);
//             } else {
//                 break;
//             }
//         }
//     }

//     function getIDRoyaltyClubLevel(uint32 _id) public view returns (uint256) {
//         StructID memory IDAccount = ids[_id];
//         return _getIDRoyalyClubLevel(IDAccount);
//     }

//     function _updateIDInRoyaltyClub(
//         StructID storage refererIDAccount,
//         uint32 _refererID,
//         uint256 _valueInUSD,
//         uint256 _currenTime
//     ) private {
//         if (
//             _getIDRoyalyClubLevel(refererIDAccount) >
//             refererIDAccount.royaltyClubPackageID
//         ) {
//             refererIDAccount.royaltyClubPackageID = _getIDRoyalyClubLevel(
//                 refererIDAccount
//             );

//             packages[refererIDAccount.royaltyClubPackageID].achieversList.push(
//                 _refererID
//             );

//             refererIDAccount.royaltyClubListIndex =
//                 packages[refererIDAccount.royaltyClubPackageID]
//                     .achieversList
//                     .length -
//                 1;

//             emit AddedInRoyaltyClubList(
//                 _refererID,
//                 refererIDAccount.royaltyClubListIndex,
//                 refererIDAccount.royaltyClubPackageID
//             );

//             if (
//                 packages[_getIDRoyalyClubLevel(refererIDAccount)]
//                     .isPayReccursive
//             ) {
//                 if (
//                     _currenTime >
//                     refererIDAccount.timeStampRoyaltyClub +
//                         packages[_getIDRoyalyClubLevel(refererIDAccount)]
//                             .timeLimit
//                 ) {
//                     refererIDAccount.timeStampRoyaltyClub = _currenTime;
//                     refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
//                 } else {
//                     refererIDAccount.royaltyClubBusinessUSD += _valueInUSD;
//                 }
//             } else {
//                 if (isPayRoyaltyClubBonus) {
//                     _increaseIDLimitBalance(
//                         refererIDAccount,
//                         packages[refererIDAccount.royaltyClubPackageID].reward
//                     );

//                     emit RoyaltyClubBonusPaid(
//                         packages[refererIDAccount.royaltyClubPackageID]
//                             .packageID,
//                         _refererID,
//                         packages[refererIDAccount.royaltyClubPackageID].reward
//                     );
//                 }
//             }
//         }
//     }

//     function _activateID(
//         uint32 _id,
//         string memory _oldID,
//         uint32 _referrerID,
//         string memory _refererOldID,
//         address _owner,
//         uint256 _valueInUSD,
//         uint256 _maxLimitUSD,
//         uint256 _currenTime,
//         uint8 _levelsLength
//     ) private {
//         StructID storage userIDAccount = ids[_id];
//         userIDAccount.id = _id;
//         userIDAccount.refererID = _referrerID;
//         userIDAccount.owner = _owner;
//         userIDAccount.joiningTime = _currenTime;
//         userIDAccount.activationTime = _currenTime;
//         userIDAccount.maxLimitAmount = _maxLimitUSD;
//         userIDAccount.selfBusinessUSD += _valueInUSD;
//         userIDAccount.oldID = _oldID;
//         for (uint8 i; i < _levelsLength; i++) {
//             uint32 refererID = userIDAccount.refererID;
//             StructID storage refererIDAccount = ids[refererID];
//             if (refererIDAccount.id == 0) {
//                 break;
//             }
//             if (i == 0) {
//                 refererIDAccount.directBusinessUSD += _valueInUSD;
//                 refererIDAccount.refereeIDs.push(_id);
//                 refererIDAccount.oldID = _refererOldID;
//             }
//             refererIDAccount.teamBusinessUSD += _valueInUSD;
//             refererIDAccount.teamIDs.push(_id);
//             emit RegisteredTeamAddress(
//                 refererIDAccount.owner,
//                 userIDAccount.refererID,
//                 _referrerID,
//                 _id
//             );
//             if (isPayRoyaltyClubBonus) {
//                 _updateIDInRoyaltyClub(
//                     refererIDAccount,
//                     refererID,
//                     _valueInUSD,
//                     _currenTime
//                 );
//             }
//             _updateCompanyTurnOver(_valueInUSD, _currenTime);
//             userIDAccount = refererIDAccount;
//         }
//         totalIDs++;
//     }

//     function activateID(uint32 _refererID) external payable {
//         uint256 _valueInWei = msg.value;
//         uint256 _valueInUSD = _ethToUSD(_valueInWei);

//         require(
//             _valueInWei >= _usdToETH(minContributionInUSD),
//             "Value should be greate then 100"
//         );

//         address _msgSender = msg.sender;
//         uint256 _currenTime = block.timestamp;
//         uint32 _id = totalIDs + 1;
//         uint32 _roiID = totalROIIDs + 1;

//         StructAccount storage userAccount = accounts[_msgSender];

//         if (isPayROI) {
//             _activateROI(_id, _roiID, _valueInUSD, _currenTime);
//         }

//         _activateID(
//             _id,
//             "",
//             _refererID,
//             "",
//             _msgSender,
//             _valueInUSD,
//             _valueInUSD * 3,
//             _currenTime,
//             maxLevelsCount
//         );

//         userAccount.accountIDs.push(_id);
//     }

//     function _topUpID(
//         uint32 _id,
//         uint256 _valueInUSD,
//         uint256 _currenTime
//     ) private {
//         uint256 _maxLevelsCount = maxLevelsCount;

//         StructID storage userIDAccount = ids[_id];

//         userIDAccount.maxLimitAmount = _valueInUSD * 2;
//         userIDAccount.selfBusinessUSD += _valueInUSD;
//         userIDAccount.topUpUSD += _valueInUSD;

//         for (uint256 i; i < _maxLevelsCount; i++) {
//             uint32 refererID = userIDAccount.refererID;
//             StructID storage refererIDAccount = ids[refererID];
//             if (refererIDAccount.id == 0) {
//                 break;
//             }

//             if (i == 0) {
//                 refererIDAccount.directBusinessUSD += _valueInUSD;
//             }

//             refererIDAccount.teamBusinessUSD += _valueInUSD;

//             if (isPayRoyaltyClubBonus) {
//                 _updateIDInRoyaltyClub(
//                     refererIDAccount,
//                     refererID,
//                     _valueInUSD,
//                     _currenTime
//                 );
//             }

//             _updateCompanyTurnOver(_valueInUSD, _currenTime);

//             userIDAccount = refererIDAccount;
//         }
//     }

//     function topUpID(uint32 _id) external payable {
//         uint256 _valueInWei = msg.value;

//         require(
//             _valueInWei >= _usdToETH(minContributionInUSD),
//             "Value should be greate then minContribution"
//         );

//         address _msgSender = msg.sender;
//         uint256 _valueInUSD = _ethToUSD(_valueInWei);
//         uint256 _currenTime = block.timestamp;
//         uint32 _roiID = totalROIIDs + 1;

//         StructID storage userIDAccount = ids[_id];

//         require(
//             userIDAccount.owner == _msgSender,
//             "You are not owner of this id."
//         );

//         if (isPayROI) {
//             _activateROI(_id, _roiID, _valueInUSD, _currenTime);
//         }

//         _topUpID(_id, _valueInUSD, _currenTime);
//     }

//     // function _updateOldIDData(
//     //     uint32 _userID,
//     //     uint256 _totalTopUp,
//     //     uint256 _limitBalanceUSD,
//     //     uint256 _maxLimitUSD,
//     //     uint256 _balanceClaimedUSD,
//     //     uint256 _joiningTime,
//     //     uint256 _activationTime
//     // ) private {
//     //     StructID storage userIDAccount = ids[_userID];
//     //     uint8 _maxLevelsCount = maxLevelsCount;

//     //     userIDAccount.joiningTime = _joiningTime;
//     //     userIDAccount.activationTime = _activationTime;
//     //     userIDAccount.selfBusinessUSDOld = _totalTopUp;
//     //     userIDAccount.referralPaidUSD = _limitBalanceUSD;
//     //     userIDAccount.balanceClaimedUSD = _balanceClaimedUSD;
//     //     userIDAccount.limitBalanceUSD = _limitBalanceUSD;
//     //     userIDAccount.maxLimitAmount = _maxLimitUSD;

//     //     if (isPayROI) {
//     //         _activateROI(_userID, totalROIIDs, _totalTopUp, block.timestamp);
//     //     }

//     //     for (uint8 i; i < _maxLevelsCount; i++) {
//     //         uint32 refererID = userIDAccount.refererID;
//     //         StructID storage refererIDAccount = ids[refererID];
//     //         if (refererIDAccount.id == 0) {
//     //             break;
//     //         }

//     //         if (i == 0) {
//     //             refererIDAccount.directBusinessUSDOld += _totalTopUp;
//     //         }

//     //         refererIDAccount.teamBusinessUSDOld += _totalTopUp;
//     //         refererIDAccount.teamIDs.push(_userID);

//     //         userIDAccount = refererIDAccount;
//     //     }
//     // }

//     // function updateIDOldIDtoAddress(
//     //     uint32[] calldata _userID,
//     //     address[] calldata _userAddress,
//     //     uint32[] calldata _referrerID,
//     //     string[] memory _oldID
//     // ) external onlyAdmin {
//     //     for (uint16 i; i < _userID.length; i++) {
//     //         StructID storage userIDAccount = ids[_userID[i]];
//     //         StructAccount storage userAccount = accounts[_userAddress[i]];

//     //         userIDAccount.id = _userID[i];
//     //         userIDAccount.oldID = _oldID[i];
//     //         userAccount.accountIDs.push(_userID[i]);
//     //         userIDAccount.owner = _userAddress[i];
//     //         userIDAccount.refererID = _referrerID[i];

//     //         emit RegisteredReferer(_userID[i], _referrerID[i]);
//     //     }
//     // }

//     // function updateUserIDDataOldAdmin(
//     //     uint32[] calldata _userID,
//     //     uint256[] calldata _totalTopUp,
//     //     uint256[] calldata _limitBalanceUSD,
//     //     uint256[] calldata _balanceClaimedUSD,
//     //     uint256[] calldata _joiningTime,
//     //     uint256[] calldata _activationTime
//     // ) external onlyAdmin {
//     //     for (uint256 i; i < _userID.length; i++) {
//     //         totalROIIDs++;
//     //         if (_totalTopUp[i] > 0) {
//     //             uint256 _maxLimitUSD = _totalTopUp[i] * 3;
//     //             _updateOldIDData(
//     //                 _userID[i],
//     //                 _totalTopUp[i],
//     //                 _limitBalanceUSD[i],
//     //                 _maxLimitUSD,
//     //                 _balanceClaimedUSD[i],
//     //                 _joiningTime[i],
//     //                 _activationTime[i]
//     //             );
//     //         }
//     //     }
//     // }

//     function updateIDTopUpDetails(
//         uint32[] memory _id,
//         uint256[] calldata _topUp,
//         uint256[] calldata _totalTopUp,
//         uint256[] calldata _activationTime,
//         uint256[] calldata _totalIncome,
//         uint256[] calldata _totalLimit
//     ) external onlyAdmin {
//         uint256 _currentTime = block.timestamp;
//         for (uint16 i; i < _id.length; i++) {
//             StructID storage idAccount = ids[_id[i]];
//             idAccount.limitBalanceUSD = _totalIncome[i];
//             idAccount.maxLimitAmount = _totalLimit[i];
//             uint256 _endTime = _activationTime[i] + _roiDuration;
//             if (_topUp[i] > 0 && _currentTime < _endTime && idAccount.limitBalanceUSD > (_totalTopUp[i] * 2)) {
//                 idAccount.roiIDs = new uint32[](0);
//                 idAccount.activationTime = _activationTime[i];
//                 idAccount.topUpUSD = _topUp[i];
                
//                 uint32 _roiID = totalROIIDs++;

//                 StructROI storage roiAccount = rois[_roiID];
//                     roiAccount.startTime = _currentTime;
//                     roiAccount.duration = _endTime - _currentTime;
//                     roiAccount.isActive = true;
//                     roiAccount.valueInUSD = _topUp[i];
//                     idAccount.roiClaimTimestamp = _currentTime;
//                     idAccount.activationTime = _endTime - _currentTime;
//                     roiAccount.ownerID = _id[i];
//                     roiAccount.roiRate = _roiRate;
//                     idAccount.roiIDs.push(_roiID);
//             }
//         }
//     }

//     function deleteAllROIs(uint256 _number) external onlyAdmin {
//         for(uint16 i; i < _number; i++) {
//             StructROI storage roiAccount = rois[i];
//            roiAccount.isActive = false;
//            roiAccount.duration = 0;
//            roiAccount.ownerID = 0;
//            roiAccount.startTime = 0;
//            roiAccount.valueInUSD = 0;
//         }
//     }

//     function updateIDJoinTime(
//         uint32[] calldata _id,
//         uint256[] calldata _joiningTime
//     ) external onlyAdmin {
//         for (uint16 i; i < _id.length; i++) {
//             StructID storage idAccount = ids[_id[i]];
//             idAccount.joiningTime = _joiningTime[i];
//         }
//     }

//     function _payReferal(uint256 _valueInUSD, uint32 _id) private {
//         uint16[] memory rates = levelRates;
//         uint256 ratesCount = rates.length;
//         StructID storage IDAccount = ids[_id];

//         uint256 totalReferralInUSD;

//         for (uint256 i; i < ratesCount; i++) {
//             uint32 refererID = IDAccount.refererID;
//             StructID storage refererIDAccount = ids[refererID];
//             if (refererIDAccount.id == 0) {
//                 break;
//             }

//             if (_checkIfIDDisabled(refererIDAccount)) {
//                 emit ReferralNotPaid(refererID, i + 1, "Referer is Disabled");
//                 IDAccount = refererIDAccount;
//                 continue;
//             }

//             if (i + 1 > _userLevelUnlockCount(refererIDAccount)) {
//                 emit ReferralNotPaid(
//                     refererID,
//                     i + 1,
//                     "Downline levels limit reached"
//                 );

//                 IDAccount = refererIDAccount;
//                 continue;
//             }

//             uint256 c = (_valueInUSD * rates[i]) / decimals;

//             refererIDAccount.referralPaidUSD += (c);

//             _increaseIDLimitBalance(refererIDAccount, c);

//             totalReferralInUSD += c;

//             emit ReferralRewardPaid(_id, refererID, c, i + 1);

//             IDAccount = refererIDAccount;
//         }

//         totalReferralPaidUSD += totalReferralInUSD;
//     }

//     function _activateROI(
//         uint32 _id,
//         uint32 _roiID,
//         uint256 _valueInUSD,
//         uint256 _currentTime
//     ) private {
//         StructROI storage roiAccount = rois[_roiID];
//         StructID storage userIDAccount = ids[_id];

//         roiAccount.isActive = true;
//         roiAccount.ownerID = _id;
//         roiAccount.valueInUSD = _valueInUSD;

//         roiAccount.roiRate = _roiRate;
//         roiAccount.startTime = _currentTime;
//         roiAccount.duration = _roiDuration;

//         userIDAccount.roiIDs.push(_roiID);

//         totalROIIDs++;
//     }

//     function _getROIALL(uint32 _id) private view returns (uint256 totalROI) {
//         StructID memory IDAccount = ids[_id];
//         uint32[] memory roiIDs = IDAccount.roiIDs;
//         uint256 roiIDsCount = roiIDs.length;

//         for (uint16 i; i < roiIDsCount; i++) {
//             StructROI storage roiAccount = rois[roiIDs[i]];

//             uint256 _currentTime = block.timestamp;
//             uint256 baseReward = (roiAccount.valueInUSD * _roiRate) /
//                 decimals /
//                 _roiDuration;

//             uint256 _timePassed = _currentTime - roiAccount.startTime;
//             totalROI = (baseReward * _min(_timePassed, roiAccount.duration));
//         }

//         totalROI - IDAccount.roiClaimedUSD;
//     }

//     function getUserTotalActiveROIValue(
//         uint32 _id
//     ) external view returns (uint256) {
//         uint32[] memory roiIDs = ids[_id].roiIDs;
//         uint256 totalActiveROIValue;

//         for (uint16 i; i < roiIDs.length; i++) {
//             StructROI storage roiAccount = rois[roiIDs[i]];
//             if (roiAccount.isActive) {
//                 totalActiveROIValue += roiAccount.valueInUSD;
//             }
//         }

//         return totalActiveROIValue;
//     }

//     function getUserIDTotalROI(uint32 _id) external view returns (uint256 roi) {
//         StructID storage IDAccount = ids[_id];
//         uint256 _roiReward = _getROIALL(_id);
//         if (
//             IDAccount.limitBalanceUSD + _roiReward <= IDAccount.maxLimitAmount
//         ) {
//             roi = _roiReward;
//         } else {
//             uint256 _limitDifference = IDAccount.maxLimitAmount -
//                 IDAccount.limitBalanceUSD;

//             roi = _limitDifference;
//         }
//     }

//     // function _claimROI(uint32 _id) private returns (uint256 roiClaimed) {
//     //     StructID storage userIDAccount = ids[_id];
//     //     StructROI storage roiAccount = rois[
//     //         userIDAccount.roiIDs[userIDAccount.roiIDs.length - 1]
//     //     ];

//     //     uint256 _currentTime = block.timestamp;

//     //     require(
//     //         msg.sender == userIDAccount.owner,
//     //         "You are not owner of this id."
//     //     );

//     //     require(
//     //         block.timestamp >=
//     //             userIDAccount.roiClaimTimestamp + _roiClaimTimelimit,
//     //         "You roi claim timelimit is not over yeh"
//     //     );

//     //     uint256 roiAll = _getROIALL(_id);

//     //     if (
//     //         userIDAccount.limitBalanceUSD + roiAll <
//     //         userIDAccount.maxLimitAmount
//     //     ) {
//     //         userIDAccount.limitBalanceUSD += roiAll;
//     //         userIDAccount.roiClaimedUSD += roiAll;

//     //         userIDAccount.roiClaimTimestamp = _currentTime;
//     //         roiClaimed = roiAll;
//     //         emit ROIClaimed(_id, roiAll);
//     //     } else {
//     //         uint256 _limitDifference = userIDAccount.maxLimitAmount -
//     //             userIDAccount.limitBalanceUSD;

//     //         userIDAccount.limitBalanceUSD = userIDAccount.maxLimitAmount;
//     //         userIDAccount.roiClaimedUSD += _limitDifference;

//     //         userIDAccount.roiClaimTimestamp = _currentTime;
//     //         roiClaimed = _limitDifference;

//     //         _disableID(userIDAccount);
//     //         emit ROIClaimed(_id, _limitDifference);
//     //         emit IDDeactivated(userIDAccount.id, "Max Limit Reached");
//     //     }

//     //     if (roiAccount.startTime + roiAccount.duration >= _currentTime) {
//     //         if (!userIDAccount.isDisabled) {
//     //             _disableID(userIDAccount);
//     //             emit IDDeactivated(userIDAccount.id, "Last staking over");
//     //         }
//     //     }
//     // }

//     // function claimROI(uint32 _id) external {
//     //     uint256 roiClaimed = _claimROI(_id);
//     //     _payReferal(roiClaimed, _id);
//     // }

//     function _userLevelUnlockCount(
//         StructID memory _userIDAccount
//     ) private view returns (uint256) {
//         uint256 userRefereeCount = _userIDAccount.refereeIDs.length;
//         uint256 count;

//         if (userRefereeCount > 0) {
//             count = userRefereeCount * _userLevelUnlockMultiplier - 1;
//         }

//         return count;
//     }

//     function getUserUnlockCount(uint32 _id) external view returns (uint256) {
//         StructID memory idAccount = ids[_id];
//         return _userLevelUnlockCount(idAccount);
//     }

//     function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
//         uint256 value = (_valueInUSD * 10 ** 18) /
//             IPriceOracle(_priceOracleContract).getPriceInUSD();
//         return value;
//     }

//     function _ethToUSD(uint256 _valueInWei) private view returns (uint256) {
//         uint256 value = (_valueInWei *
//             IPriceOracle(_priceOracleContract).getPriceInUSD()) / 10 ** 18;
//         return value;
//     }

//     function isUserDisabledByAdmin(
//         address _userAddress
//     ) external view returns (bool) {
//         return accounts[_userAddress].isDisabled;
//     }

//     function disableUserAdmin(address _userAddress) external onlyAdmin {
//         _disabledUsersList.push(_userAddress);
//         accounts[_userAddress].isDisabled = true;
//     }

//     function removeUserFromDisableList(
//         address _userAddress
//     ) external onlyAdmin {
//         accounts[_userAddress].isDisabled = false;
//         uint256 disabledUsersLength = _disabledUsersList.length;

//         for (uint256 i; i < disabledUsersLength; i++) {
//             if (_disabledUsersList[i] == _userAddress) {
//                 _disabledUsersList[i] = _disabledUsersList[
//                     disabledUsersLength - 1
//                 ];

//                 _disabledUsersList.pop();
//             }
//         }
//     }

//     function getPriceOracleContract() external view returns (address) {
//         return _priceOracleContract;
//     }

//     function setPriceOracleContract(
//         address _contractAddress
//     ) external onlyAdmin {
//         _priceOracleContract = _contractAddress;
//     }

//     function claimBalance(uint32 _id, uint256 _valueInUSD) external {
//         StructID storage idAccount = ids[_id];
//         require(idAccount.owner == msg.sender, "You are not owner of this id.");
//         uint256 userLimitBalance = _idLimitBalance(idAccount);
//         uint256 userTotalWithdrawUSD = idAccount.balanceClaimedUSD;
//         require(
//             _valueInUSD <= userLimitBalance - userTotalWithdrawUSD,
//             "Please enter value less then your balance."
//         );

//         idAccount.balanceClaimedUSD += _valueInUSD;
//         payable(msg.sender).transfer(_usdToETH(_valueInUSD));
//     }

//     function _min(uint256 x, uint256 y) private pure returns (uint256) {
//         if (x > y) {
//             return y;
//         }

//         return x;
//     }

//     function setROI(
//         uint16 _roiRateInDecimals,
//         uint256 _roiDurationInDays,
//         uint256 _roiClaimTimelimitInSeconds
//     ) external onlyAdmin {
//         _roiRate = _roiRateInDecimals;
//         _roiDuration = _roiDurationInDays * 1 days;
//         _roiClaimTimelimit = _roiClaimTimelimitInSeconds;
//     }

//     function setROIIDCount(uint32 _count) external onlyAdmin {
//         totalROIIDs = _count;
//     }

//     function updateTotalIDs(uint32 _value) external onlyAdmin {
//         totalIDs = _value;
//     }

//     function setMinContribution(uint256 _valueInWei) external onlyOwner {
//         minContributionInUSD = _valueInWei;
//     }

//     function getMinContributionETH() external view returns (uint256) {
//         return _usdToETH(minContributionInUSD);
//     }

//     function sendETHAdmin(address _address, uint256 _value) external onlyOwner {
//         payable(_address).transfer(_value);
//     }

//     function withdrawETHAdmin() external onlyOwner {
//         payable(msg.sender).transfer(address(this).balance);
//     }

//     function withdrawTokensAdmin(
//         address _tokenAddress,
//         uint256 _value
//     ) external onlyOwner {
//         IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
//     }

//     function _authorizeUpgrade(
//         address newImplementation
//     ) internal override onlyOwner {}
// }
