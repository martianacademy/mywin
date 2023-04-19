import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import { BSCTestnet, Config, DAppProvider } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { MyVeeChain } from "./constants/ChainInfo";
import { ProtectedNavigation } from "./Navigation/ProtectedNavigation";
import { JoinPage, Stake, User } from "./pages";
import {
  FutureSecureWallet,
  Staking,
  Team,
  Transactions,
  UserIDDisplay,
} from "./pages/User";
import { Dashboard } from "./pages/User/Dashboard";
import { UserDashboard } from "./pages/User/Dashboard/UserDashboard/UserDashboard";
import * as serviceWorker from "./serviceWorker";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <JoinPage />,
      },
      {
        path: "stake/:referrerAddress",
        element: <Stake />,
      },
      {
        path: "user",
        element: (
          <ProtectedNavigation>
            <User />
          </ProtectedNavigation>
        ),
        children: [
          {
            index: true,
            element: <UserIDDisplay />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                index: true,
                element: <UserDashboard />,
              },
              {
                path: "stakings",
                element: <Staking />,
              },
              {
                path: "future-secure-wallet",
                element: <FutureSecureWallet />,
              },
              {
                path: "team",
                element: <Team />,
              },
              {
                path: "transactions",
                element: <Transactions />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const DappConfig: Config = {
  readOnlyChainId: MyVeeChain.chainId,
  readOnlyUrls: {
    [MyVeeChain.chainId]: "https://rpc.myveescan.com",
    [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  networks: [MyVeeChain, BSCTestnet],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        [MyVeeChain.chainId]: "https://rpc.myveescan.com",
        [BSCTestnet.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
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

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <DAppProvider config={DappConfig}>
        <RouterProvider router={router}></RouterProvider>
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>
);

serviceWorker.unregister();
