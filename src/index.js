import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { GlobalContextProvider } from "./context";

const { chains, publicClient } = configureChains([bsc], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "LegendCoin",
  projectId: "d2e1927dd61f1a0aa5865ae990b814d5",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalContextProvider>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Router>
          <App />
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  </GlobalContextProvider>
);
