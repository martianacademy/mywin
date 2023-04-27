import { Chain } from "@usedapp/core";

export const MyVeeChain: Chain = {
  chainId: 50000,
  chainName: "MyVee Mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0xEB4BC397A076238A7e9d084cfaee42E11a93822F",
  multicall2Address: "0xC90c7221bd990b3aFb046d3fba2dE13023ba9eF5",
  getExplorerAddressLink: (address: string) =>
    `https://www.myveescan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://www.myveescan.com/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: "https://rpc.blockchain.myveex.com/",
  blockExplorerUrl: "https://www.myveescan.com",
  nativeCurrency: {
    name: "MyVee",
    symbol: "MYVEE",
    decimals: 18,
  },
};
