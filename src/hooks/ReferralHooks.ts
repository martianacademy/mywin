import { useCall, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { AddressZero, useSupportedNetworkInfo } from '../constants';

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.referralContractAddress && {
        contract: currentNetwork?.referralContractInterface,
        method: methodName,
        args: arg,
      }
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
  accountIDs: number[];
} => {
  const value = useCallHook('getUserAccount', [address]);
  const valueObject = {
    isDisabled: value ? value?.[0].isDisabled : false,
    accountIDs: value ? value?.[0].accountIDs : [],
  };
  return valueObject;
};

export type userIDAccountType = {
  id: string;
  oldID: string;
  isActive: boolean;
  owner: string;
  joiningTime: number;
  deactivateTime: number;
  refererID: string;
  refereeIDs: string[] | [];
  teamIDs: BigNumber[] | [];
  teamLevel: BigNumber[] | [];
  selfBusiness: number;
  selfBusinessOld: number;
  directBusiness: number;
  directBusinessOld: number;
  teamBusiness: number;
  teamBusinessOld: number;
  royaltyClubBusiness: number;
  timeStampRoyaltyClub: number;
  royaltyClubPackageID: number;
  royaltyClubListIndex: number;
  referralPaid: number;
  rewardPaidRoyaltyClub: number;
  totalTopUp: number;
  totalIncome: number;
  totalMaxLimitAmount: number;
  currentTopUp: number;
  currentTopUpTime: number;
  totalROIClaimed: number;
  roiIDs: BigNumber[] | [];
  roiClaimed: number;
  roiClaimedTimestamp: number;
  balanceClaimed: number;
};

export const useIDAccount = (id: string): userIDAccountType => {
  const value = useCallHook('getIDAccount', [id])?.[0];
  console.log(value)
  const valueObject: userIDAccountType = {
    id: value ? value.id : '0',
    oldID: value ? value?.oldID : '0',
    isActive: value ? value?.isActive : false,
    owner: value ? value?.owner : AddressZero,
    joiningTime: value ? Number(value?.joiningTime?.toString()) : 0,
    deactivateTime: value ? Number(value?.deactivateTime?.toString()) : 0,
    refererID: value ? value?.refererID?.toString() : '0',
    refereeIDs: value ? value?.refereeIDs : [],
    teamIDs: value ? value?.teamIDs : [],
    teamLevel: value ? value?.teamLevel : [],
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
    timeStampRoyaltyClub: value
      ? Number(value?.timeStampRoyaltyClub?.toString())
      : 0,
    royaltyClubPackageID: value ? Number(value?.royaltyClubPackageID) : 0,
    royaltyClubListIndex: value
      ? Number(value?.royaltyClubListIndex?.toString())
      : 0,
    referralPaid: value ? Number(formatEther(value?.referralPaid)) : 0,
    rewardPaidRoyaltyClub: value
      ? Number(formatEther(value?.rewardPaidRoyaltyClub))
      : 0,
    totalTopUp: value ? Number(formatEther(value?.totalTopUp)) : 0,
    totalIncome: value ? Number(formatEther(value?.totalIncome)) : 0,
    totalMaxLimitAmount: value
      ? Number(formatEther(value?.totalMaxLimitAmount))
      : 0,
    currentTopUp: value ? Number(formatEther(value?.currentTopUp)) : 0,
    currentTopUpTime: value ? Number(value?.currentTopUp?.toString()) : 0,
    totalROIClaimed: value ? Number(formatEther(value?.totalROIClaimed)) : 0,
    roiIDs: value ? value?.roiIDs : [],
    roiClaimed: value ? Number(formatEther(value?.roiClaimed)) : 0,
    roiClaimedTimestamp: value
      ? Number(value?.roiClaimedTimestamp?.toString())
      : 0,
    balanceClaimed: value ? Number(formatEther(value?.balanceClaimed)) : 0,
  };

  return valueObject;
};

export const useROIAccount = (roiID: string | undefined) => {
  const value = useCallHook('getROIAccount', [roiID ?? '0']);
  const valueObject = {
    id: value ? value?.[0]?.id : 0,
    isActive: value ? value?.[0]?.isActive : false,
    ownerID: value ? value?.[0]?.ownerID : '0',
    value: value ? Number(formatEther(value?.[0]?.value)) : 0,
    roiRate: value ? Number(value?.[0]?.roiRate) : 0,
    startTime: value ? Number(value?.[0]?.startTime) : 0,
  };
  return valueObject;
};

export const useGetUserAllActiveROIValue = (userID: string | undefined) => {
  const value = useCallHook('getUserTotalActiveROIValue', [userID ?? '0'])?.[0];
  const valueFormatted = value ? Number(formatEther(value?.[0] ?? 0)) : 0;

  return valueFormatted;
};

export const useGetUserIDTotalROI = (userID: string | undefined) => {
  const value = useCallHook('getUserIDTotalROI', [userID ?? '0'])?.[0];
  const valueFormatted = value ? Number(formatEther(value ?? 0)) : 0;

  return valueFormatted;
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
  teamIDs: number[];
  teamLevels: number[];
  teamCount: number;
} => {
  const value = useCallHook('getIDTeam', [id]);
  const valueObject = {
    teamIDs: value ? value?.teamIDs : [],
    teamLevels: value ? value?.teamLevels : [],
    teamCount: value ? Number(value?.teamCount) : 0,
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
  const value = useCallHook('getIDRewardPaid', [id]);
  const valueObject = {
    referralPaid: value ? Number(formatEther(value?.referralPaid)) : 0,
    totalROIClaimed: value ? Number(formatEther(value?.totalROIClaimed)) : 0,
    rewardPaidRoyaltyClub: value
      ? Number(formatEther(value?.rewardPaidRoyaltyClub))
      : 0,
    totalRewardPaid: value ? Number(formatEther(value?.totalRewardPaid)) : 0,
  };
  return valueObject;
};

export const useMinContributionETH = () => {
  const value = useCallHook('getMinContributionETH', [])?.[0];
  return value ? Number(formatEther(value)) : 0;
};
