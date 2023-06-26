require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      myvee: "abc",
      bsc: process.env.BSC_MAINNET_KEY
    },
    customChains: [
      {
        network: "myvee",
        chainId: 50000,
        urls: {
          apiURL: "https://old.myveescan.com/api",
          browserURL: "https://myveescan.com",
        },
      },
    ],
  },

  defaultNetwork: "myvee",
  networks: {
    hardhat: {
      gas: "auto",
    },

    ganache: {
      url: "HTTP://127.0.0.1:7545",
      chainId: 1337,
      accounts: [PRIVATE_KEY],
      gas: "auto",
    },

    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
    myvee: {
      url: "https://rpc.blockchain.myveex.com/",
      chainId: 50000,
      accounts: [PRIVATE_KEY],
    },
  },
};
