//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVariables {
    function isAdmin(address _address) external view returns (bool);

    function getPriceOracleContract() external view returns (address);

    function getROIContract() external view returns (address);

    function getFutureSecureWalletContract() external view returns (address);
}

interface IPriceOracle {
    function getPriceInUSD() external view returns (uint256);
}

interface IROI {
    function isROIActive(uint32 _roiId) external view returns (bool);

    function activateROIAdmin(
        uint32 _ownerId,
        uint256 _value,
        uint256 _startTime,
        uint256 _resetTime,
        uint256 _duration
    ) external returns (uint32);
}

interface IFutureSecureWallet {
    function stakeByAdmin(address _userAddress, uint256 _value) external;
}

contract ReferralV4Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;

    uint16[] public levelRates;
    uint16 public decimals;

    uint8 public maxLevels;
    uint256 public minContributionUSD;

    uint256 public totalRoyaltyClubBonusPaid;
    uint256 public totalReferralPaid;

    uint32 public totalIds;

    bool public isPayRoyaltyClubBonus;
    uint8 public royaltyClubPackageCount;

    uint8 private _userLevelUnlockMultiplier;

    uint256 public companyTurnoverWithTimeLimit;
    uint256 public companyTurnoverTimeStamp;
    uint256 public companyTurnoverTimeLimit;

    address[] public disabledUsersList;
    address[] public users;

    bool public isActivateROI;
    bool public isPayReferral;

    uint8 public futureScureWalletContribution;

    struct StructAccount {
        bool isActive;
        uint32[] accountIds;
        string userName;
    }

    struct StructId {
        uint32 id;
        string oldId;
        uint256 joiningTime;
        bool isAddedToUserList;
        address owner;
        uint32 refererId;
        bool hasUpline;
        uint32[] refereeIds;
        uint32[] teamIds;
        uint32[] teamLevel;
        uint256[] selfBusinessArray;
        uint256 selfBusiness;
        uint256 selfBusinessOld;
        uint256 directBusiness;
        uint256 directBusinessOld;
        uint256 teamBusiness;
        uint256 teamBusinessOld;
        uint256 royaltyClubBusiness;
        uint256 timeStampRoyaltyClub;
        uint8 royaltyClubPackageId;
        uint32 royaltyClubListIndex;
        uint256 royaltyClubRewardPaid;
        uint256 topUpIncome;
        uint256 topUp;
        uint256 maxLimit;
        uint256 activationTime;
        uint256 deactivationTime;
        uint256 referralPaid;
        uint32[] roiIds;
        uint256 roiPaid;
        uint256 roiClaimedTime;
        uint256 walletBalance;
        bool isActive;
        bool isROIDisabled;
        bool isIdVisibilityDisabled;
        bool canWindraw;
    }

    struct StructPackages {
        uint8 packageId;
        uint256 selfBusiness;
        uint256 directBusiness;
        uint256 teamBusiness;
        string rankName;
        uint256 reward;
        uint256 businessLimit;
        uint256 timeLimit;
        bool isPayReccursive;
        uint32[] achieversList;
    }

    uint8 public packagesCount;

    mapping(address => StructAccount) private accounts;
    mapping(uint32 => StructId) private ids;
    mapping(uint8 => StructPackages) private packages;

    event DeactivatedId(uint32 id, string reason);
    event ActivatedId(uint32 id);
    event OwnerChangedId(uint32 id, address owner);

    event RegisteredReferer(uint32 indexed id, uint32 indexed refererId);

    event RegisteredTeamAddress(
        uint32 indexed refereeId,
        uint32 indexed referrerId,
        uint32 indexed parentAccountId
    );

    event RegisterRefererFailed(
        address indexed refereeId,
        address indexed referrerId,
        string indexed reason
    );

    event ReferralRewardPaid(
        uint32 indexed refereeId,
        uint32 indexed referrerId,
        uint256 indexed amount,
        uint8 level
    );

    event AddedInRoyaltyClubList(uint32 id, uint32 index, uint8 rank);

    event RoyaltyClubBonusPaid(
        uint32 indexed userid,
        uint8 indexed packageId,
        uint256 indexed amount
    );

    event ReferralNotPaid(
        uint32 indexed refererId,
        uint8 indexed level,
        string indexed reason
    );

    event PackageAdded(uint8 packageId);

    event PackageUpdated(uint8 packageId);

    event PackageRemoved(uint8 packageId);

    function initialize() public initializer {
        _variablesContract = 0x0B8bf5FeB9Fca57D9c5d27185dDF3017e99a2d36;

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

        maxLevels = 50;

        minContributionUSD = 100000000000000000000;

        _userLevelUnlockMultiplier = 2;

        isPayRoyaltyClubBonus = false;
        isActivateROI = true;
        isPayReferral = true;

        companyTurnoverTimeLimit = 30 days;

        futureScureWalletContribution = 20;

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

    function getUserAccount(
        address _address
    ) external view returns (StructAccount memory) {
        return accounts[_address];
    }

    function getIdLimits(
        uint32 _id
    )
        external
        view
        returns (uint256 topUpIncome, uint256 topUp, uint256 maxLimit)
    {
        StructId memory idAccount = ids[_id];
        topUpIncome = idAccount.topUpIncome;
        topUp = idAccount.topUp;
        maxLimit = idAccount.maxLimit;
    }

    function getIdAccount(uint32 _id) external view returns (StructId memory) {
        return ids[_id];
    }

    function setMaxLevelsAdmin(uint8 _valueDecimals) external onlyOwner {
        maxLevels = _valueDecimals;
    }

    function setLevelDecimals(uint16 _value) external onlyOwner {
        decimals = _value;
    }

    function setLevelRates(uint8[] calldata _value) external onlyOwner {
        levelRates = _value;
    }

    function getRoyaltyClubPackageInfo(
        uint8 _packageId
    ) external view returns (StructPackages memory) {
        return packages[_packageId];
    }

    function getAchieversList(
        uint8 _packageId
    ) external view returns (uint32[] memory) {
        return packages[_packageId].achieversList;
    }

    // function setRoyaltyClubPackage(
    //     uint8 packageId,
    //     uint256 selfBusiness,
    //     uint256 directBusiness,
    //     uint256 teamBusiness,
    //     string memory rankName,
    //     uint256 reward,
    //     uint256 businessLimit,
    //     uint256 timeLimit,
    //     bool isPayReccursive
    // ) external onlyOwner {
    //     StructPackages storage package = packages[packageId];
    //     package.packageId = packageId;
    //     package.selfBusiness = selfBusiness;
    //     package.directBusiness = directBusiness;
    //     package.teamBusiness = teamBusiness;
    //     package.rankName = rankName;
    //     package.reward = reward;
    //     package.businessLimit = businessLimit;
    //     package.timeLimit = timeLimit;
    //     package.isPayReccursive = isPayReccursive;

    //     emit PackageAdded(packageId);
    // }

    // function setRoyaltyPackageCount(uint8 _valueDecimals) external onlyOwner {
    //     packagesCount = _valueDecimals;
    // }

    // function payRoyaltyClubReccursiveBonusAdmin() external onlyOwner {
    //     uint8 _royaltyPackagesCount = packagesCount;

    //     for (uint8 i; i < _royaltyPackagesCount; i++) {
    //         StructPackages memory package = packages[i];
    //         if (!package.isPayReccursive) {
    //             continue;
    //         }

    //         uint32[] memory acheiversList = package.achieversList;
    //         uint32 achieversCount = uint32(acheiversList.length);
    //         uint256 valueToDistribute = (companyTurnoverWithTimeLimit *
    //             package.reward) /
    //             decimals /
    //             achieversCount;

    //         for (uint32 j; j < achieversCount; j++) {
    //             StructId storage idAccount = ids[acheiversList[j]];

    //             if (
    //                 idAccount.royaltyClubBusiness > package.businessLimit &&
    //                 idAccount.topUpIncome <= idAccount.maxLimit
    //             ) {
    //                 idAccount.topUpIncome += valueToDistribute;

    //                 emit RoyaltyClubBonusPaid(
    //                     acheiversList[j],
    //                     package.packageId,
    //                     valueToDistribute
    //                 );
    //             }
    //         }
    //     }

    //     companyTurnoverWithTimeLimit = 0;
    //     companyTurnoverTimeStamp = block.timestamp;
    // }

    function _checkIfIdDisabled(
        StructId storage _idAccount
    ) private view returns (bool) {
        if (
            !_idAccount.isActive ||
            _idAccount.topUpIncome >= _idAccount.maxLimit
        ) {
            return true;
        } else if (
            _idAccount.roiIds.length > 0 &&
            !IROI(IVariables(_variablesContract).getROIContract()).isROIActive(
                _idAccount.roiIds[_idAccount.roiIds.length - 1]
            )
        ) {
            return true;
        }

        return false;
    }

    function _disableId(StructId storage _idAccount) private {
        _idAccount.isActive = false;
        _idAccount.roiIds = new uint32[](0);
        _idAccount.topUpIncome = 0;
        _idAccount.topUp = 0;
        _idAccount.maxLimit = 0;
        _idAccount.deactivationTime = block.timestamp;

        emit DeactivatedId(_idAccount.id, "Max Limit Reached");
    }

    function updateIdWhenClaimROI(
        uint32 _id,
        uint256 _value
    ) external onlyAdmin {
        StructId storage idAccount = ids[_id];
        idAccount.roiClaimedTime = block.timestamp;
        idAccount.roiPaid += _value;
        _increaseIdTopUpIncome(idAccount, _value);
    }

    function _increaseIdTopUpIncome(
        StructId storage _idAccount,
        uint256 _value
    ) private {
        if (_idAccount.topUpIncome + _value <= _idAccount.maxLimit) {
            _idAccount.topUpIncome += _value;
            _idAccount.walletBalance += _value;
        } else {
            _idAccount.walletBalance +=
                _idAccount.maxLimit -
                _idAccount.topUpIncome;
            _disableId(_idAccount);
        }
    }

    function increaseIdTopIncome(
        uint32 _id,
        uint256 _value
    ) external onlyAdmin {
        StructId storage _idAccount = ids[_id];
        _increaseIdTopUpIncome(_idAccount, _value);
    }

    function _updateCompanyTurnOver(
        uint256 _value,
        uint256 _currenTime
    ) private {
        if (_currenTime > companyTurnoverTimeStamp + companyTurnoverTimeLimit) {
            companyTurnoverTimeStamp = _currenTime;
            companyTurnoverWithTimeLimit = _value;
        } else {
            companyTurnoverWithTimeLimit += _value;
        }
    }

    function _getIdRoyalyClubLevel(
        StructId memory idAccount
    ) private view returns (uint8 prevCount) {
        uint8 _royaltyPackagesCount = packagesCount;

        for (uint8 i; i < _royaltyPackagesCount; i++) {
            if (
                idAccount.selfBusiness >= packages[i].selfBusiness &&
                idAccount.directBusiness >= packages[i].directBusiness &&
                idAccount.teamBusiness >= packages[i].teamBusiness
            ) {
                prevCount = uint8(i);
            } else {
                break;
            }
        }
    }

    // function getIdRoyaltyClubLevel(uint32 _id) public view returns (uint256) {
    //     StructId memory IdAccount = ids[_id];
    //     return _getIdRoyalyClubLevel(IdAccount);
    // }

    function _updateIdInRoyaltyClub(
        StructId storage refererIdAccount,
        uint256 _value,
        uint256 _currenTime
    ) private {
        if (
            _getIdRoyalyClubLevel(refererIdAccount) >
            refererIdAccount.royaltyClubPackageId
        ) {
            refererIdAccount.royaltyClubPackageId = _getIdRoyalyClubLevel(
                refererIdAccount
            );

            packages[refererIdAccount.royaltyClubPackageId].achieversList.push(
                refererIdAccount.id
            );

            refererIdAccount.royaltyClubListIndex = uint32(
                packages[refererIdAccount.royaltyClubPackageId]
                    .achieversList
                    .length - 1
            );

            emit AddedInRoyaltyClubList(
                refererIdAccount.id,
                refererIdAccount.royaltyClubListIndex,
                refererIdAccount.royaltyClubPackageId
            );

            if (
                packages[_getIdRoyalyClubLevel(refererIdAccount)]
                    .isPayReccursive
            ) {
                if (
                    _currenTime >
                    refererIdAccount.timeStampRoyaltyClub +
                        packages[_getIdRoyalyClubLevel(refererIdAccount)]
                            .timeLimit
                ) {
                    refererIdAccount.timeStampRoyaltyClub = _currenTime;
                    refererIdAccount.royaltyClubBusiness += _value;
                } else {
                    refererIdAccount.royaltyClubBusiness += _value;
                }
            } else {
                if (isPayRoyaltyClubBonus) {
                    _increaseIdTopUpIncome(
                        refererIdAccount,
                        packages[refererIdAccount.royaltyClubPackageId].reward
                    );

                    emit RoyaltyClubBonusPaid(
                        refererIdAccount.id,
                        packages[refererIdAccount.royaltyClubPackageId]
                            .packageId,
                        packages[refererIdAccount.royaltyClubPackageId].reward
                    );
                }
            }
        }
    }

    function _payReferal(uint256 _value, uint32 _id) private {
        uint16[] memory rates = levelRates;
        uint8 levelRatesCount = uint8(rates.length);
        StructId storage idAccount = ids[_id];

        uint256 totalReferralIn;

        for (uint8 i; i < levelRatesCount; i++) {
            uint32 referrerId = idAccount.refererId;
            StructId storage refererIDAccount = ids[referrerId];
            if (refererIDAccount.id == 0) {
                emit ReferralNotPaid(referrerId, i + 1, "Reached to id 0.");
                break;
            }

            if (refererIDAccount.refererId == referrerId) {
                emit ReferralNotPaid(
                    referrerId,
                    i + 1,
                    "Self Refer id won't get referral."
                );
                break;
            }

            if (_checkIfIdDisabled(refererIDAccount)) {
                emit ReferralNotPaid(referrerId, i + 1, "Referer is Disabled");
                idAccount = refererIDAccount;
                continue;
            }

            if (refererIDAccount.refereeIds.length > 0 && ((refererIDAccount.refereeIds.length * _userLevelUnlockMultiplier) - 1) > i) {
                uint256 c = (_value * rates[i]) / decimals;
                refererIDAccount.referralPaid += (c);
                _increaseIdTopUpIncome(refererIDAccount, c);
                totalReferralIn += c;
                emit ReferralRewardPaid(_id, referrerId, c, i + 1);
            } else {
                emit ReferralNotPaid(
                    referrerId,
                    i + 1,
                    "Downline levels limit reached"
                );
            }

            idAccount = refererIDAccount;
        }

        totalReferralPaid += totalReferralIn;
    }

    function payReferralAdmin(uint256 _value, uint32 _id) external onlyAdmin {
        if (isPayReferral) {
            _payReferal(_value, _id);
        }
    }

    function _activateId(
        StructId storage _idAccount,
        address _owner,
        uint32 _id,
        uint32 _referrerId,
        uint256 _value,
        uint256 _currentMaxLimit,
        uint256 _currentTime,
        uint256 _maxLevels
    ) private {
        if (_idAccount.id == 0) {
            _idAccount.id = _id;
        }

        if (!_idAccount.isActive) {
            _idAccount.isActive = true;
        }

        if (!_idAccount.isAddedToUserList) {
            users.push(_owner);
        }

        if (_idAccount.owner == address(0)) {
            _idAccount.owner = _owner;
        }

        if (_idAccount.joiningTime == 0) {
            _idAccount.joiningTime = _currentTime;
        }

        if (!_idAccount.hasUpline) {
            _idAccount.refererId = _referrerId;
            _idAccount.hasUpline = true;
        }

        _idAccount.topUpIncome = 0;
        _idAccount.topUp = _currentMaxLimit / 3;
        _idAccount.maxLimit = _currentMaxLimit;
        _idAccount.selfBusinessArray.push(_value);
        _idAccount.selfBusiness += _value;
        _idAccount.activationTime = _currentTime;
        _idAccount.roiIds = new uint32[](0);
        _idAccount.canWindraw = true;

        for (uint8 i; i < _maxLevels; i++) {
            uint32 refererId = _idAccount.refererId;
            StructId storage refererIdAccount = ids[refererId];
            if (refererIdAccount.id == 0) {
                break;
            }

            if (i == 0) {
                refererIdAccount.directBusiness += _value;
                refererIdAccount.refereeIds.push(_id);
            }

            refererIdAccount.teamBusiness += _value;

            if (_referrerId > 0) {
                refererIdAccount.teamIds.push(_id);
                refererIdAccount.teamLevel.push(i + 1);

                emit RegisteredTeamAddress(
                    _id,
                    _referrerId,
                    refererIdAccount.id
                );
            }

            if (isPayRoyaltyClubBonus) {
                _updateIdInRoyaltyClub(refererIdAccount, _value, _currentTime);
            }

            _idAccount = refererIdAccount;
        }

        _updateCompanyTurnOver(_value, _currentTime);
    }

    function activateId(uint32 _refererId) external payable {
        uint256 _valueWei = msg.value;
        uint256 _value = _ethToUSD(_valueWei);

        require(
            _value >= minContributionUSD,
            "Value less then minContribution"
        );

        address _msgSender = msg.sender;
        uint256 _currentTime = block.timestamp;
        uint32 _id = totalIds + 1;

        StructAccount storage userAccount = accounts[_msgSender];
        StructId storage _idAccount = ids[_id];

        _activateId(
            _idAccount,
            _msgSender,
            _id,
            _refererId,
            _value,
            _value * 3,
            _currentTime,
            maxLevels
        );

        if (isActivateROI) {
            uint32 _roiId = IROI(
                IVariables(_variablesContract).getROIContract()
            ).activateROIAdmin(
                    _id,
                    _value,
                    _currentTime,
                    _currentTime,
                    400 days
                );
            _idAccount.roiIds.push(_roiId);
        }

        userAccount.accountIds.push(_id);
        userAccount.isActive = true;
        totalIds++;
    }

    function activateIdAdmin(
        address _userAddress,
        uint32 _refererId,
        uint256 _valueInUSD,
        uint256 _activationTime,
        uint256 _roiStartTime,
        uint256 _roiResetTime,
        uint256 _roiDurationInDays
    ) external onlyAdmin {
        uint32 _id = totalIds + 1;
        StructAccount storage userAccount = accounts[_userAddress];
        StructId storage _idAccount = ids[_id];
        uint256 _currentTime = block.timestamp;

        _activateId(
            _idAccount,
            _userAddress,
            _id,
            _refererId,
            _valueInUSD * 1e18,
            _valueInUSD * 1e18 * 3,
            _activationTime == 0 ? _currentTime : _activationTime,
            maxLevels
        );

        if (isActivateROI) {
            uint32 _roiId = IROI(
                IVariables(_variablesContract).getROIContract()
            ).activateROIAdmin(
                    _id,
                    _valueInUSD * 1e18,
                    _roiStartTime == 0 ? _currentTime : _roiStartTime,
                    _roiResetTime == 0 ? _currentTime : _roiResetTime,
                    _roiDurationInDays * 1 days
                );
            _idAccount.roiIds.push(_roiId);
        }

        userAccount.accountIds.push(_id);
        totalIds++;
    }

    function topUpId(uint32 _id) external payable {
        uint256 _valueWei = msg.value;
        uint256 _value = _ethToUSD(_valueWei);

        require(
            _value >= minContributionUSD,
            "Value less then minContribution"
        );

        address _msgSender = msg.sender;
        uint256 _currentTime = block.timestamp;
        StructId storage _idAccount = ids[_id];

        uint256 _currentMaxLimit = (_idAccount.maxLimit -
            _idAccount.topUpIncome) + (_value * 3);

        uint256 _currentROILimit = _idAccount.topUpIncome <
            ((_idAccount.maxLimit * 2) / 3)
            ? (((_idAccount.maxLimit * 2) / 3) - _idAccount.topUpIncome) / 3
            : 0;

        _activateId(
            _idAccount,
            _msgSender,
            _id,
            0,
            _value,
            _currentMaxLimit,
            _currentTime,
            maxLevels
        );

        if (isActivateROI) {
            uint32 _roiId = IROI(
                IVariables(_variablesContract).getROIContract()
            ).activateROIAdmin(
                    _id,
                    _value + _currentROILimit,
                    _currentTime,
                    _currentTime,
                    400 days
                );
            _idAccount.roiIds.push(_roiId);
        }
    }

    function _usdToETH(uint256 _valueInUSD) private view returns (uint256) {
        uint256 value = (_valueInUSD * 10 ** 18) /
            IPriceOracle(
                IVariables(_variablesContract).getPriceOracleContract()
            ).getPriceInUSD();
        return value;
    }

    function _ethToUSD(uint256 _valueWei) private view returns (uint256) {
        uint256 value = (_valueWei *
            IPriceOracle(
                IVariables(_variablesContract).getPriceOracleContract()
            ).getPriceInUSD()) / 10 ** 18;
        return value;
    }

    function setVisibilityOfAddressAdmin(
        address[] calldata _userAddress,
        bool[] calldata _trueOrFalse
    ) external onlyAdmin {
        for (uint16 i; i < _userAddress.length; i++) {
            accounts[_userAddress[i]].isActive = _trueOrFalse[i];
        }
    }

    function setWithdrawalStatusAdmin(
        uint32[] calldata _id,
        bool[] calldata _trueOrFalse
    ) external onlyAdmin {
        for (uint16 i; i < _id.length; i++) {
            ids[_id[i]].canWindraw = _trueOrFalse[i];
        }
    }

    function setIdStatusAdmin(
        uint32[] calldata _id,
        bool[] calldata _trueOrFalse
    ) external onlyAdmin {
        for (uint16 i; i < _id.length; i++) {
            ids[_id[i]].isActive = _trueOrFalse[i];
        }
    }

    function setIdOwnerAddressAdmin(
        uint32[] calldata _id,
        address[] calldata _userAddress
    ) external onlyAdmin {
        for (uint16 i; i < _id.length; i++) {
            ids[_id[i]].owner = _userAddress[i];
            accounts[_userAddress[i]].accountIds.push(_id[i]);
        }
    }

    function claimBalance(uint32 _id) external {
        StructId storage idAccount = ids[_id];
        if (!IVariables(_variablesContract).isAdmin(msg.sender)) {
            require(
                idAccount.owner == msg.sender,
                "You are not owner of this id."
            );
            require(
                idAccount.walletBalance >= 10e18,
                "Balance is less than min withdrawal."
            );
            // require(
            //     _valueInUSD <= idAccount.walletBalance,
            //     "value greater than balance."
            // );
            require(
                idAccount.canWindraw,
                "This id withdraw is not enabled by admin."
            );
        }

        // idAccount.walletBalance -= _valueInUSD;
        uint256 walletBalance = idAccount.walletBalance;
        uint256 _futureSecureWalletValue = (walletBalance *
            futureScureWalletContribution) / 100;
        IFutureSecureWallet(
            IVariables(_variablesContract).getFutureSecureWalletContract()
        ).stakeByAdmin(idAccount.owner, _futureSecureWalletValue);
        payable(idAccount.owner).transfer(
            _usdToETH(walletBalance - _futureSecureWalletValue)
        );

        delete idAccount.walletBalance;
    }

    // function increaseBalanceAdmin(uint32 _id, uint256 _valueInDecimals) external onlyAdmin {
    //     ids[_id].walletBalance += _valueInDecimals * 1e18;
    // }

    // function _min(uint256 x, uint256 y) private pure returns (uint256) {
    //     if (x > y) {
    //         return y;
    //     }

    //     return x;
    // }

    // function updateTotalIds(uint32 _value) external onlyAdmin {
    //     totalIds = _value;
    // }

    function setMinContribution(uint256 _valueInUSD) external onlyOwner {
        minContributionUSD = _valueInUSD;
    }

    function getMinContributionETH() external view returns (uint256) {
        return _usdToETH(minContributionUSD);
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
