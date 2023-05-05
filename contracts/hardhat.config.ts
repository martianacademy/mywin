import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades"
import dotenv from "dotenv"

/** @type import('hardhat/config').HardhatUserConfig */
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSC_MAINNET_KEY = process.env.BSC_MAINNET_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    apiKey: {
      bscTestnet: BSC_MAINNET_KEY!,
      polygon: POLYGON_API_KEY!,
      myvee: "abc",
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

    myvee: {
      url: "https://rpc.blockchain.myveex.com/",
      chainId: 50000,
      accounts: [PRIVATE_KEY!],
    },

    ganache: {
      url: "HTTP://127.0.0.1:7545",
      chainId: 1337,
      accounts: [PRIVATE_KEY!],
      gas: "auto",
    },

    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY!],
    },

    bscTestnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      chainId: 97,
      accounts: [PRIVATE_KEY!],
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      chainId: 137,
      accounts: [PRIVATE_KEY!],
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      chainId: 80001,
      accounts: [PRIVATE_KEY!],
    },
  },
};

export default config;
