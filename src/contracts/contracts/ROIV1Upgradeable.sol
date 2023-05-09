//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVariables {
    function isAdmin(address _address) external view returns (bool);

    function getPriceOracleContract() external view returns (address);

    function getReferralContract() external view returns (address);

    function getFutureSecureWalletContract() external view returns (address);
}

interface IReferral {
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

    function getIdAccount(uint32 _id) external view returns (StructId memory);

    function payReferralAdmin(uint256 _value, uint32 _id) external;

    function increaseIdTopIncome(uint32 _id, uint256 _value) external;

    function updateIdWhenClaimROI(uint32 _id, uint256 _value) external;
}

contract ROIV1Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;

    uint32 public totalROIIDs;
    uint256 public totalROIPaid;
    uint256 public totalROIValue;

    uint16 public decimals;

    uint16 public _roiRate;
    uint256 public _roiDuration;
    uint256 public _roiClaimTimelimit;

    bool public isPayROI;

    struct StructROI {
        uint32 id;
        uint32 ownerId;
        uint256 value;
        uint16 roiRate;
        uint256 startTime;
        uint256 resetTime;
        uint256 endTime;
    }

    mapping(uint32 => StructROI) private rois;

    event ROIActivated(
        uint32 _owner,
        uint32 _roiId,
        uint256 _value,
        uint16 _rewardRate
    );
    event ROIDeactivated(uint32 _owner, uint32 _roiId);

    event ROIClaimed(uint256 indexed _owner, uint256 indexed _rewardRate);

    function initialize() public initializer {
        _variablesContract = 0x0B8bf5FeB9Fca57D9c5d27185dDF3017e99a2d36;

        decimals = 1000;

        _roiRate = 5;
        _roiClaimTimelimit = 1 days;
        _roiDuration = 400 days;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    modifier onlyAdmin() {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "Only Admin can access this function.."
        );
        _;
    }

    receive() external payable {}

    function getROIAccount(
        uint32 _roiID
    ) external view returns (StructROI memory) {
        return rois[_roiID];
    }

    function _isROIActive(uint32 _roiId) private view returns (bool) {
        StructROI memory roiAccount = rois[_roiId];

        if (roiAccount.endTime > block.timestamp) {
            return true;
        }

        return false;
    }

    function isROIActive(uint32 _roiId) external view returns (bool) {
        return _isROIActive(_roiId);
    }

    function _activateROI(
        uint32 _ownerId,
        uint256 _value,
        uint256 _startTime,
        uint256 _resetTime,
        uint256 _duration
    ) private returns (uint32) {
        uint32 _roiId = totalROIIDs++;
        StructROI storage roiAccount = rois[_roiId + 1];
        roiAccount.id = _roiId + 1;
        roiAccount.ownerId = _ownerId;
        roiAccount.value = _value;
        roiAccount.roiRate = _roiRate;
        roiAccount.startTime = _startTime;
        roiAccount.resetTime = _resetTime;
        roiAccount.endTime = _startTime + _duration;

        totalROIValue += _value;

        return _roiId + 1;
    }

    function activateROIAdmin(
        uint32 _ownerId,
        uint256 _value,
        uint256 _startTime,
        uint256 _resetTime,
        uint256 _duration
    ) external onlyAdmin returns (uint32) {
        return
            _activateROI(_ownerId, _value, _startTime, _resetTime, _duration);
    }

    function _getROIALL(
        uint32 _id,
        uint256 _currentTime
    ) private view returns (uint256 totalROI) {
        IReferral.StructId memory idAccount = IReferral(
            IVariables(_variablesContract).getReferralContract()
        ).getIdAccount(_id);
        uint32[] memory roiIDs = idAccount.roiIds;
        uint256 roiIDsCount = roiIDs.length;

        if (
            idAccount.topUpIncome < (idAccount.topUp * 2) &&
            roiIDsCount > 0 &&
            !idAccount.isROIDisabled
        ) {
            for (uint16 i; i < roiIDsCount; i++) {
                StructROI storage roiAccount = rois[roiIDs[i]];
                if (_isROIActive(roiIDs[i])) {
                    uint256 baseReward = (roiAccount.value * _roiRate) /
                        decimals;
                    uint256 _timePassed = _currentTime - roiAccount.resetTime;
                    totalROI += (baseReward * _timePassed) / 1 days;
                }
            }
        } else {
            totalROI = 0;
        }
    }

    function getUserIDTotalROI(uint32 _id) external view returns (uint256) {
        return _getROIALL(_id, block.timestamp);
    }

    function getUserTotalActiveROIValue(
        uint32 _id
    ) external view returns (uint256 roiTotalValue) {
        IReferral.StructId memory idAccount = IReferral(
            IVariables(_variablesContract).getReferralContract()
        ).getIdAccount(_id);
        uint32[] memory roiIDs = idAccount.roiIds;
        uint256 roiIDsCount = roiIDs.length;

        if (
            idAccount.topUpIncome < (idAccount.topUp * 2) &&
            roiIDsCount > 0 &&
            !idAccount.isROIDisabled
        ) {
            for (uint16 i; i < roiIDsCount; i++) {
                StructROI storage roiAccount = rois[roiIDs[i]];
                if (_isROIActive(roiIDs[i])) {
                    roiTotalValue += roiAccount.value;
                }
            }
        } else {
            roiTotalValue = 0;
        }
    }

    function _resetAllROI(
        IReferral.StructId memory idAccount,
        uint256 _currentTime
    ) private {
        uint32[] memory roiIDs = idAccount.roiIds;
        uint256 roiIDsCount = roiIDs.length;

        for (uint16 i; i < roiIDsCount; i++) {
            StructROI storage roiAccount = rois[roiIDs[i]];
            if (_isROIActive(roiIDs[i])) {
                roiAccount.resetTime = _currentTime;
            }
        }
    }

    function _claimROI(
        IReferral.StructId memory idAccount
    ) private returns (uint256 roiClaimed) {
        uint256 _currentTime = block.timestamp;
        uint256 roiAll = _getROIALL(idAccount.id, _currentTime);

        if (
            idAccount.topUpIncome <= idAccount.topUp * 2 &&
            idAccount.topUpIncome + roiAll < idAccount.topUp * 2
        ) {
            roiClaimed = roiAll;
            totalROIPaid += roiClaimed;
        } else if (idAccount.topUpIncome <= idAccount.topUp * 2) {
            uint256 _limitDifference = (idAccount.topUp * 2) -
                idAccount.topUpIncome;
            roiClaimed = _limitDifference;
            totalROIPaid += _limitDifference;
        }

        if (roiClaimed > 0) {
            IReferral(IVariables(_variablesContract).getReferralContract())
                .updateIdWhenClaimROI(idAccount.id, roiClaimed);
            IReferral(IVariables(_variablesContract).getReferralContract())
                .payReferralAdmin(roiClaimed, idAccount.id);

            emit ROIClaimed(idAccount.id, roiClaimed);
        }

        _resetAllROI(idAccount, _currentTime);
    }

    function claimROI(uint32 _id) external returns (uint256) {
        IReferral.StructId memory idAccount = IReferral(
            IVariables(_variablesContract).getReferralContract()
        ).getIdAccount(_id);

        if (!IVariables(_variablesContract).isAdmin(msg.sender)) {
            require(
                msg.sender == idAccount.owner,
                "You are not owner of this id."
            );

            require(
                block.timestamp >=
                    idAccount.roiClaimedTime + _roiClaimTimelimit,
                "Your roi claim timelimit is not over yet."
            );

            require(!idAccount.isROIDisabled, "Account disabled by admin");
        }

        return _claimROI(idAccount);
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        if (x > y) {
            return y;
        }

        return x;
    }

    function setROIAdmin(
        uint16 _roiRateInDecimals,
        uint256 _durationInDays,
        uint256 _roiClaimTimelimitInSeconds
    ) external onlyAdmin {
        _roiRate = _roiRateInDecimals;
        _roiDuration = _durationInDays * 1 days;
        _roiClaimTimelimit = _roiClaimTimelimitInSeconds;
    }

    function setROIIDCount(uint32 _count) external onlyAdmin {
        totalROIIDs = _count;
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
