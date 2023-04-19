import { BSCTestnet, ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers";
import { BNBLogoSVG, BSCScanLogoCircleLight, USDTLogoSVG } from "../assets";
import { MyVeeChain } from "./ChainInfo";

import PriceOracle from "../contracts/artifacts/contracts/PriceOracleUpgradeable.sol/PriceOracleUpgradeable.json";
import StakingInterface from "../contracts/artifacts/contracts/StakingUpgradeable.sol/StakingUpgradeable.json";
import ReferralInterface from "../contracts/artifacts/contracts/ReferralV2Upgradeable.sol/ReferralV2Upgradeable.json";

export const TokenName = "MyWin";
export const TokenSymbol = "MYWIN";
export const ProjectName = "MyWin Incorporation";
export const DefaultReferrer = "0x49066990635F9AEA7706dD73183177a463352445";
export const DefaultReferrerID = "0";

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
    priceOracleContractAddress: "0xC90c7221bd990b3aFb046d3fba2dE13023ba9eF5",
    priceOracleContractInterface: new Contract(
      "0xC90c7221bd990b3aFb046d3fba2dE13023ba9eF5",
      PriceOracle?.abi
    ),
    referralContractAddress: "0xE13Bb7CE7208B7879abA9f0485DdE753E72B25B0",
    referralContractInterface: new Contract(
      "0xE13Bb7CE7208B7879abA9f0485DdE753E72B25B0",
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
    NetworkExplorerName: "BscScanTestnet",
    NetworkExplorerLogo: BSCScanLogoCircleLight,
  },
  [BSCTestnet.chainId]: {
    priceOracleContractAddress: "0x26a9dD00ba9f050f3243a906a13C805784BeD67f",
    priceOracleContractInterface: new Contract(
      "0x26a9dD00ba9f050f3243a906a13C805784BeD67f",
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
