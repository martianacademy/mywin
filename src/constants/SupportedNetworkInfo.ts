import { ERC20Interface } from '@usedapp/core';
import { Contract } from 'ethers';
import { MyUSDSVG, tokenLogoSVG } from '../assets';
import { MyVeeChain } from './ChainInfo';

import VariablesV2Interface from '../contracts/artifacts/contracts/VariablesV2Upgradeable.sol/VariablesV2Upgradeable.json';
import PriceOracleInterface from '../contracts/artifacts/contracts/PriceOracleUpgradeable.sol/PriceOracleUpgradeable.json';
import ReferralV4Interface from '../contracts/artifacts/contracts/ReferralV4Upgradeable.sol/ReferralV4Upgradeable.json';
import ROIV1Interface from "../contracts/artifacts/contracts/ROIV1Upgradeable.sol/ROIV1Upgradeable.json"
import FutureSecureWalletV1Interface from "../contracts/artifacts/contracts/FutureSecureWalletUpgradeable.sol/FutureSecureWalletV1Upgradeable.json"
import { futureSecureWalletV1ContractAddress, myUSDContractAddress, priceOracleContractAddress, referralV4ContractAddress, roiV1ContractAddress, variablesV2ContractAddress } from './ContractAddress';

export const TokenName = 'MyWin';
export const TokenSymbol = 'MYWIN';
export const ProjectName = 'MyWin Incorporation';
export const DefaultReferrer = '0x49066990635F9AEA7706dD73183177a463352445';
export const DefaultReferrerID = '0';
export const AddressZero: string = '0x0000000000000000000000000000000000000000';

export const MyUSDLogo = MyUSDSVG;
export const MyUSDSymbol = 'MYUSD';

export const StakingInfo = {
  rewardRate: 100,
  duration: 10,
  minValue: 0.001,
  packages: [0],
};

export const website = `${window.location.origin}/#/stake`;

export const DeepLinks = {
  trustwallet: `https://link.trustwallet.com/open_url?coin_id=966&url=${website}`,
  metamask: `https://metamask.app.link/dapp/${website}`,
  coinbase: `https://go.cb-w.com/dapp?cb_url=${website}`,
};

export interface tokenType {
  ContractAddress: string;
  ContractInterface: Contract;
  Name: string;
  Symbol: string;
  Decimals: number;
  Logo: string;
}

export const useSupportedNetworkInfo = {
  [MyVeeChain.chainId]: {
    variablesContractAddress: variablesV2ContractAddress,
    variablesContractInterface: new Contract(
      variablesV2ContractAddress,
      VariablesV2Interface.abi
    ),
    priceOracleContractAddress:
    priceOracleContractAddress,
    priceOracleContractInterface: new Contract(
      priceOracleContractAddress,
      PriceOracleInterface?.abi
    ),
    referralContractAddress: referralV4ContractAddress,
    referralContractInterface: new Contract(
      referralV4ContractAddress,
      ReferralV4Interface.abi
    ),
    roiContractAddress: roiV1ContractAddress,
    roiContractInterface: new Contract(
      roiV1ContractAddress,
      ROIV1Interface.abi
    ),
    futureSecureWalletContractAddress: futureSecureWalletV1ContractAddress,
    futureSecureWalletContractInterface: new Contract(
      futureSecureWalletV1ContractAddress,
      FutureSecureWalletV1Interface.abi
    ),
    Native: {
      ContractAddress: '',
      ContractInterface: new Contract(
        myUSDContractAddress,
        ERC20Interface
      ),
      Name: 'MYVEE',
      Symbol: 'MYVEE',
      Decimals: 18,
      Logo: tokenLogoSVG,
    },
    MYUSD: {
      ContractAddress: myUSDContractAddress,
      ContractInterface: new Contract(
        myUSDContractAddress,
        ERC20Interface
      ),
      Name: 'MyUSD',
      Symbol: 'MYUSD',
      Decimals: 18,
      Logo: MyUSDSVG,
    },
    Network: MyVeeChain,
    NetworkRPCUrl: 'https://rpc.blockchain.myveex.com',
    NetworkColor: 'yellow.500',
    NetworkExplorerLink: MyVeeChain.blockExplorerUrl,
    NetworkExplorerName: 'MyVeeScan',
    NetworkExplorerLogo: tokenLogoSVG,
  },
};
