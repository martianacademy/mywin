//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
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
        bool isActive;
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
        uint256 referralPaid;
        uint32[] roiIds;
        uint256 roiPaid;
        uint256 roiClaimedTime;
        uint256 walletBalance;
        bool canWindraw;
    }

    function getIdAccount(uint32 _id) external view returns (StructId memory);

    function payReferralAdmin(uint256 _value, uint32 _id) external;
    function increaseIdTopIncome(
        uint32 _id,
        uint256 _value
    ) external;
}

contract ReferralV3Upgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;

    uint32 public totalROIIDs;
    uint256 public totalROIPaid;
    uint256 public totalROIValue;

    uint16 public decimals;

    uint16 private _roiRate;
    uint256 private _roiDuration;
    uint256 private _roiClaimTimelimit;

    bool public isPayROI;

    struct StructROI {
        uint32 id;
        bool isActive;
        uint32 ownerId;
        uint256 value;
        uint16 roiRate;
        uint256 startTime;
        uint256 duration;
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
        _variablesContract = 0x7ecF19C95F2639Cf0183639Dba852fADE713eEfc;

        decimals = 1000;

        _roiRate = 1000;
        _roiDuration = 400 days;
        _roiClaimTimelimit = 1 days;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    modifier onlyAdmin() {
        require(
            IVariables(_variablesContract).isAdmin(msg.sender),
            "You are not admin."
        );
        _;
    }

    receive() external payable {}

    function getROIAccount(
        uint32 _roiID
    ) external view returns (StructROI memory) {
        return rois[_roiID];
    }

    function _activateROI(
        uint32 _id,
        uint32 _roiID,
        uint256 _value,
        uint256 _currentTime
    ) private {
        StructROI storage roiAccount = rois[_roiID];

        roiAccount.isActive = true;
        roiAccount.ownerId = _id;
        roiAccount.value = _value;

        roiAccount.roiRate = _roiRate;
        roiAccount.startTime = _currentTime;
    }

    function activateROIAdmin(
        uint32 _id,
        uint256 _value,
        uint256 _currentTime
    ) external returns (uint32 _roiId) {
        _roiId = totalROIIDs++;
        _activateROI(_id, _roiId, _value, _currentTime);
    }

    function _getROIALL(uint32 _id) private view returns (uint256 totalROI) {
        IReferral.StructId memory idAccount = IReferral(
            IVariables(_variablesContract).getReferralContract()
        ).getIdAccount(_id);
        uint32[] memory roiIDs = idAccount.roiIds;
        uint256 roiIDsCount = roiIDs.length;

        if (idAccount.topUpIncome < (idAccount.topUp * 2) && roiIDsCount > 0) {
            for (uint16 i; i < roiIDsCount; i++) {
                StructROI storage roiAccount = rois[roiIDs[i]];
                if (roiAccount.isActive) {
                    uint256 baseReward = (roiAccount.value * _roiRate) /
                        decimals;
                    uint256 _timePassed = block.timestamp -
                        roiAccount.startTime;
                    totalROI += (baseReward * _timePassed) / 1 days;
                }
            }
        } else {
            totalROI = 0;
        }
    }

    function getUserIDTotalROI(uint32 _id) external view returns (uint256) {
        return _getROIALL(_id);
    }

    function _claimROI(uint32 _id) private returns (uint256 roiClaimed) {
        IReferral.StructId memory idAccount = IReferral(
            IVariables(_variablesContract).getReferralContract()
        ).getIdAccount(_id);
        uint256 _currentTime = block.timestamp;

        require(msg.sender == idAccount.owner, "You are not owner of this id.");

        require(
            block.timestamp >= idAccount.roiClaimedTime + _roiClaimTimelimit,
            "You roi claim timelimit is not over yeh"
        );

        uint256 roiAll = _getROIALL(_id);

        if (
            idAccount.topUpIncome <= idAccount.topUp * 2 &&
            idAccount.topUpIncome + roiAll < idAccount.topUp * 2
        ) {
            idAccount.topUpIncome += roiAll;
            idAccount.roiPaid += roiAll;

            idAccount.roiClaimedTime = _currentTime;
            roiClaimed = roiAll;
            IReferral(
            IVariables(_variablesContract).getReferralContract()).increaseIdTopIncome(
       _id,
        roiClaimed
    );
            emit ROIClaimed(_id, roiClaimed);
        } else if (idAccount.topUpIncome <= idAccount.topUp * 2) {
            uint256 _limitDifference = (idAccount.topUp * 2) -
                idAccount.topUpIncome;

            idAccount.topUpIncome = idAccount.topUp * 2;
            roiClaimed = _limitDifference;
            IReferral(
            IVariables(_variablesContract).getReferralContract()).increaseIdTopIncome(
       _id,
        roiClaimed
    );
    emit ROIClaimed(_id, roiClaimed);
        }
    }

    function claimROI(uint32 _id) external returns (uint256) {
        return _claimROI(_id);
    }

    function _min(uint256 x, uint256 y) private pure returns (uint256) {
        if (x > y) {
            return y;
        }

        return x;
    }

    function setROI(
        uint16 _roiRateInDecimals,
        uint256 _roiDurationInDays,
        uint256 _roiClaimTimelimitInSeconds
    ) external onlyAdmin {
        _roiRate = _roiRateInDecimals;
        _roiDuration = _roiDurationInDays * 1 days;
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
