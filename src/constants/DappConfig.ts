import { Config } from '@usedapp/core';
import { WalletConnectConnector } from '@usedapp/wallet-connect-connector';
import { getDefaultProvider } from 'ethers';
import { MyVeeChain } from './ChainInfo';

export const DappConfig: Config = {
  readOnlyChainId: MyVeeChain.chainId,
  readOnlyUrls: {
    [MyVeeChain.chainId]: getDefaultProvider(
      'https://rpc.blockchain.myveex.com'
    ),
  },
  networks: [MyVeeChain],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        [MyVeeChain.chainId]: 'https://rpc.blockchain.myveex.com',
      },
      qrcodeModalOptions: {
        desktopLinks: [
          'metamask',
          'ledger',
          'tokenary',
          'wallet',
          'wallet 3',
          'secuX',
          'ambire',
          'wallet3',
          'apolloX',
          'zerion',
          'sequence',
          'punkWallet',
          'kryptoGO',
          'nft',
          'riceWallet',
          'vision',
          'keyring',
        ],
        mobileLinks: ['metamask', 'trust'],
      },
    }),
  },
};
