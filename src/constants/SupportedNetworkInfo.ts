import { BSCTestnet, ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers";
import { BNBLogoSVG, BSCScanLogoCircleLight, MyUSDSVG, tokenLogoSVG, USDTLogoSVG } from "../assets";
import { MyVeeChain } from "./ChainInfo";

import PriceOracle from "../contracts/artifacts/contracts/PriceOracleUpgradeable.sol/PriceOracleUpgradeable.json";
import ReferralInterface from "../contracts/artifacts/contracts/ReferralV2Upgradeable.sol/ReferralV2Upgradeable.json";

export const TokenName = "MyWin";
export const TokenSymbol = "MYWIN";
export const ProjectName = "MyWin Incorporation";
export const DefaultReferrer = "0x49066990635F9AEA7706dD73183177a463352445";
export const DefaultReferrerID = "0";
export const AddressZero: string = "0x0000000000000000000000000000000000000000";

export const MyUSDLogo = USDTLogoSVG;
export const MyUSDSymbol = "MYUSD";

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
    priceOracleContractAddress: "0x286d6392042B4D7180Fd6d20F8D35c8776815774",
    priceOracleContractInterface: new Contract(
      "0x286d6392042B4D7180Fd6d20F8D35c8776815774",
      PriceOracle?.abi
    ),
    referralContractAddress: "0xE82D70137Fc7f16dbbB9eF2D6902748e47ccAef2",
    referralContractInterface: new Contract(
      "0xE82D70137Fc7f16dbbB9eF2D6902748e47ccAef2",
      ReferralInterface.abi
    ),
    Native: {
      ContractAddress: "",
      ContractInterface: "",
      Name: "MYVEE",
      Symbol: "MYVEE",
      Decimals: 18,
      Logo: tokenLogoSVG,
    },
    MYUSD: {
      ContractAddress: "0xD2F6a7C009A9B112e451DA05BBd16357a3D323ea",
      ContractInterface: new Contract(
        "0xD2F6a7C009A9B112e451DA05BBd16357a3D323ea",
        ERC20Interface
      ),
      Name: "MyUSD",
      Symbol: "MYUSD",
      Decimals: 18,
      Logo: MyUSDSVG,
    },
    Network: MyVeeChain,
    NetworkRPCUrl: "https://rpc.blockchain.myveex.com",
    NetworkColor: "yellow.500",
    NetworkExplorerLink: MyVeeChain.blockExplorerUrl,
    NetworkExplorerName: "MyVeeScan",
    NetworkExplorerLogo: tokenLogoSVG,
  },
  [BSCTestnet.chainId]: {
    priceOracleContractAddress: "0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168",
    priceOracleContractInterface: new Contract(
      "0xF594034b9Ab80fDB03560Ba3E5C8eEa0B0eAd168",
      PriceOracle?.abi
    ),
    referralContractAddress: "0x02EA7f23dDE72a26E96AaA141c87a4E1c6AB357B",
    referralContractInterface: new Contract(
      "0x02EA7f23dDE72a26E96AaA141c87a4E1c6AB357B",
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
