import { BSCTestnet, Config } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { MyVeeChain } from "./ChainInfo";

export const DappConfig: Config = {
  readOnlyChainId: MyVeeChain.chainId,
  readOnlyUrls: {
    [MyVeeChain.chainId]: "https://rpc.blockchain.myveex.com",
  },
  networks: [MyVeeChain, BSCTestnet],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        [MyVeeChain.chainId]: "https://rpc.blockchain.myveex.com",
      },
      qrcodeModalOptions: {
        desktopLinks: [
          "metamask",
          "ledger",
          "tokenary",
          "wallet",
          "wallet 3",
          "secuX",
          "ambire",
          "wallet3",
          "apolloX",
          "zerion",
          "sequence",
          "punkWallet",
          "kryptoGO",
          "nft",
          "riceWallet",
          "vision",
          "keyring",
        ],
        mobileLinks: ["metamask", "trust"],
      },
    }),
  },
};
