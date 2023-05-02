const { ethers } = require('ethers');

const provider = new ethers.providers.WebSocketProvider('ws://rpc.blockchain.myveex.com:8546');

// Example: get the latest block number
provider.getBlockNumber().then((blockNumber) => {
  console.log('Latest block number:', blockNumber);
});

// Example: subscribe to new block headers
provider.on('block', (blockNumber) => {
  console.log('New block header:', blockNumber);
});
