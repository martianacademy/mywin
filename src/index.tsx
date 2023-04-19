import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { DappConfig } from "./constants/DappConfig";
import { Routes } from "./Navigation/Routes";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <DAppProvider config={DappConfig}>
        <RouterProvider router={Routes}></RouterProvider>
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>
);

serviceWorker.unregister();
