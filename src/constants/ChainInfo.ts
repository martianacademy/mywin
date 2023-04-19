import { Chain } from "@usedapp/core";

export const MyVeeChain: Chain = {
  chainId: 7878,
  chainName: "MyVee Mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0x014060FA292b4e59976D296d869bCA5feF0429c1",
  multicall2Address: "0x95AEb61064f16c902DB56B0C044Da7c09D5d1558",
  getExplorerAddressLink: (address: string) =>
    `https://www.myveescan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://www.myveescan.com/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: "https://rpc.myveescan.com/",
  blockExplorerUrl: "https://www.myveescan.com",
  nativeCurrency: {
    name: "MyVee",
    symbol: "MYVEE",
    decimals: 18,
  },
};
