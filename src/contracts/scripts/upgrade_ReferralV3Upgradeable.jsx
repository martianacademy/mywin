const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gas = await ethers.provider.getGasPrice();

  console.log("Gas price is ", gas);

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  const formatedBalance = ethers.utils.formatEther(balance);

  console.log("Account balance:", formatedBalance.toString(), "ETH");

  const TokenV2 = await ethers.getContractFactory("ReferralV3Upgradeable");
  const mc = await upgrades.upgradeProxy(
    "0xf72BBf777076BBfE2f779EEC69Eee9578399e353",
    TokenV2,
    { gasPrice: gas }
  );

  //Old Implementation Contract 0xf4e638f67a4a40677ce972c7048aef2e7afc65bd

  await mc.deployed();
  console.log("Contract Upgraded:", mc.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
