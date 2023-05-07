import { useCall, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { AddressZero, useSupportedNetworkInfo } from '../constants';

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      {
        contract: currentNetwork?.referralContractInterface,
        method: methodName,
        args: arg,
      },
    ) ?? {};

  if (error) {
    console.error('Referral Hooks Error', error.message);
    return undefined;
  }
  return value;
};

export const useReferralAccountMap = (
  address: string
): {
  isDisabled: boolean;
  accountIds: string[];
  userName: string;
} => {
  const value = useCallHook('getUserAccount', [address])?.[0];
  const valueObject = {
    isDisabled: value ? value?.isDisabled : false,
    accountIds: value ? value?.accountIds : [],
    userName: value ? value?.userName : 'Anonymous',
  };
  return valueObject;
};

export type userIDAccountType = {
  id: string;
  oldId: string;
  joiningTime: number;
  isAddedToUserList: boolean;
  owner: string;
  refererId: string;
  hasUpline: boolean;
  refereeIds: string[];
  teamIds: string[];
  teamLevel: string[];
  selfBusinessArray: BigNumber[];
  selfBusiness: number;
  selfBusinessOld: number;
  directBusiness: number;
  directBusinessOld: number;
  teamBusiness: number;
  teamBusinessOld: number;
  royaltyClubBusiness: number;
  timeStampRoyaltyClub: number;
  royaltyClubPackageId: number;
  royaltyClubListIndex: number;
  royaltyClubRewardPaid: number;
  topUpIncome: number;
  topUp: number;
  maxLimit: number;
  activationTime: number;
  referralPaid: number;
  roiIds: string[];
  roiPaid: number;
  roiClaimedTime: number;
  walletBalance: number;
  isActive: boolean;
  isROIDisabled: boolean;
  isIdVisibilityDisabled: boolean;
  canWindraw: boolean;
};

export const useIDAccount = (id: string): userIDAccountType => {
  const value = useCallHook('getIdAccount', [id])?.[0];
  const valueObject: userIDAccountType = {
    id: value ? value?.id : '',
    oldId: value ? value?.oldId : '',
    joiningTime: value ? Number(value?.joiningTime) : 0,
    isAddedToUserList: value ? value?.isAddedToUserList : false,
    owner: value ? value?.owner : AddressZero,
    refererId: value ? value?.refererId : '',
    hasUpline: value ? value?.hasUpline : false,
    refereeIds: value ? value?.refereeIds : [],
    teamIds: value ? value?.teamIds : [],
    teamLevel: value ? value?.teamLevel : [],
    selfBusinessArray: value ? value?.selfBusinessArray : [],
    selfBusiness: value ? Number(formatEther(value?.selfBusiness)) : 0,
    selfBusinessOld: value ? Number(formatEther(value?.selfBusinessOld)) : 0,
    directBusiness: value ? Number(formatEther(value?.directBusiness)) : 0,
    directBusinessOld: value
      ? Number(formatEther(value?.directBusinessOld))
      : 0,
    teamBusiness: value ? Number(formatEther(value?.teamBusiness)) : 0,
    teamBusinessOld: value ? Number(formatEther(value?.teamBusinessOld)) : 0,
    royaltyClubBusiness: value
      ? Number(formatEther(value?.royaltyClubBusiness))
      : 0,
    timeStampRoyaltyClub: value ? Number(value?.timeStampRoyaltyClub) : 0,
    royaltyClubPackageId: value ? Number(value?.royaltyClubPackageId) : 0,
    royaltyClubListIndex: value ? Number(value?.royaltyClubListIndex) : 0,
    royaltyClubRewardPaid: value
      ? Number(formatEther(value?.royaltyClubRewardPaid))
      : 0,
    topUpIncome: value ? Number(formatEther(value?.topUpIncome)) : 0,
    topUp: value ? Number(formatEther(value?.topUp)) : 0,
    maxLimit: value ? Number(formatEther(value?.maxLimit)) : 0,
    activationTime: value ? Number(value?.activationTime) : 0,
    referralPaid: value ? Number(formatEther(value?.referralPaid)) : 0,
    roiIds: value ? value?.roiIds : [],
    roiPaid: value ? Number(formatEther(value?.roiPaid)) : 0,
    roiClaimedTime: value ? Number(value?.roiClaimedTime) : 0,
    walletBalance: value ? Number(formatEther(value?.walletBalance)) : 0,
    isActive: value ? value?.isActive : false,
    isROIDisabled: value ? value?.isROIDisabled : false,
    isIdVisibilityDisabled: value ? value?.isIdVisibilityDisabled : false,
    canWindraw: value ? value?.canWindraw : false,
  };

  return valueObject;
};

// export const useGetIDTotalBusiness = (id: string) => {
//   const value = useCallHook('getIDTotalBusiness', [id]);

//   const valueObject = {
//     selfBusiness: value ? Number(formatEther(value?.selfBusiness)) : 0,
//     selfBusinessOld: value ? Number(formatEther(value?.selfBusinessOld)) : 0,
//     directBusiness: value ? Number(formatEther(value?.directBusiness)) : 0,
//     directBusinessOld: value ? Number(formatEther(value?.directBusinessOld)) : 0,
//     teamBusiness: value ? Number(formatEther(value?.teamBusiness)) : 0,
//     teamBusinessOld: value ? Number(formatEther(value?.teamBusinessOld)) : 0,
//   };

//   return valueObject;
// };

export const useGetIDTeam = (
  id: string
): {
  teamIDs: string[];
  teamLevels: string[];
  teamCount: number;
} => {
  const idAccount = useIDAccount(id);
  const valueObject = {
    teamIDs: idAccount ? idAccount?.teamIds : [],
    teamLevels: idAccount ? idAccount?.teamLevel : [],
    teamCount: idAccount ? Number(idAccount?.teamIds?.length) : 0,
  };

  return valueObject;
};

export const useGetIDRewardPaid = (
  id: string
): {
  referralPaid: number;
  totalROIClaimed: number;
  rewardPaidRoyaltyClub: number;
  totalRewardPaid: number;
} => {
  const idAccount = useIDAccount(id);
  const valueObject = {
    referralPaid: idAccount?.referralPaid,
    totalROIClaimed: idAccount?.roiPaid,
    rewardPaidRoyaltyClub: idAccount?.royaltyClubRewardPaid,

    totalRewardPaid:
      idAccount?.referralPaid +
      idAccount?.roiPaid +
      idAccount?.royaltyClubRewardPaid,
  };
  return valueObject;
};

export const useMinContributionETH = () => {
  const value = useCallHook('getMinContributionETH', [])?.[0];
  return value ? Number(formatEther(value)) : 0;
};
