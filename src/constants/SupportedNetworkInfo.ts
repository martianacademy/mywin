import { BSCTestnet, ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers";
import { BNBLogoSVG, BSCScanLogoCircleLight } from "../assets";
import { MyVeeChain } from "./ChainInfo";

import PriceOracle from "../contracts/artifacts/contracts/PriceOracleUpgradeable.sol/PriceOracleUpgradeable.json";
import ReferralInterface from "../contracts/artifacts/contracts/ReferralV2Upgradeable.sol/ReferralV2Upgradeable.json";

export const TokenName = "MyWin";
export const TokenSymbol = "MYWIN";
export const ProjectName = "MyWin Incorporation";
export const DefaultReferrer = "0x49066990635F9AEA7706dD73183177a463352445";
export const DefaultReferrerID = "0";
export const AddressZero: string = "0x0000000000000000000000000000000000000000";

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
    priceOracleContractAddress: "0x701D48A7e16B5885Bb3D5f5156b9B9f0186c6C3e",
    priceOracleContractInterface: new Contract(
      "0x701D48A7e16B5885Bb3D5f5156b9B9f0186c6C3e",
      PriceOracle?.abi
    ),
    referralContractAddress: "0xcA5FD81b5ac7555D1e5120b4e3C030B321E0F752",
    referralContractInterface: new Contract(
      "0xcA5FD81b5ac7555D1e5120b4e3C030B321E0F752",
      ReferralInterface.abi
    ),
    Native: {
      ContractAddress: "",
      ContractInterface: "",
      Name: "MYVEE",
      Symbol: "MYVEE",
      Decimals: 18,
      Logo: BNBLogoSVG,
    },
    MYUSD: {
      ContractAddress: "0xF42F09f9BCD61D46B743C1A204c6eE5eaF8023e8",
      ContractInterface: new Contract(
        "0xF42F09f9BCD61D46B743C1A204c6eE5eaF8023e8",
        ERC20Interface
      ),
      Name: "MyUSD",
      Symbol: "MYUSD",
      Decimals: 18,
      Logo: BNBLogoSVG,
    },
    Network: MyVeeChain,
    NetworkRPCUrl: "https://rpc.myveescan.com",
    NetworkColor: "yellow.500",
    NetworkExplorerLink: MyVeeChain.blockExplorerUrl,
    NetworkExplorerName: "MyVeeScan",
    NetworkExplorerLogo: BSCScanLogoCircleLight,
  },
  [BSCTestnet.chainId]: {
    priceOracleContractAddress: "0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168",
    priceOracleContractInterface: new Contract(
      "0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168",
      PriceOracle?.abi
    ),
    referralContractAddress: "0x2612A322DD2F3B3F8eAF77c9b5B7c1318f88f9a7",
    referralContractInterface: new Contract(
      "0x2612A322DD2F3B3F8eAF77c9b5B7c1318f88f9a7",
      ReferralInterface.abi
    ),
    Native: {
      ContractAddress: "",
      ContractInterface: "",
      Name: "BSCTestnet",
      Symbol: "tBNB",
      Decimals: 18,
      Logo: BNBLogoSVG,
    },
    MYUSD: {
      ContractAddress: "0xF42F09f9BCD61D46B743C1A204c6eE5eaF8023e8",
      ContractInterface: new Contract(
        "0xF42F09f9BCD61D46B743C1A204c6eE5eaF8023e8",
        ERC20Interface
      ),
      Name: "MyUSD",
      Symbol: "MYUSD",
      Decimals: 18,
      Logo: BNBLogoSVG,
    },
    Network: BSCTestnet,
    NetworkRPCUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    NetworkColor: "yellow.500",
    NetworkExplorerLink: BSCTestnet.blockExplorerUrl,
    NetworkExplorerName: "BscScanTestnet",
    NetworkExplorerLogo: BSCScanLogoCircleLight,
  },
};
