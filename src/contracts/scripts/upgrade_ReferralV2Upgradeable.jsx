const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gas = await ethers.provider.getGasPrice();

  console.log("Gas price is ", gas);

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  const formatedBalance = ethers.utils.formatEther(balance);

  console.log("Account balance:", formatedBalance.toString(), "ETH");

  const TokenV2 = await ethers.getContractFactory("ReferralV2Upgradeable");
  const mc = await upgrades.upgradeProxy(
    "0x2612A322DD2F3B3F8eAF77c9b5B7c1318f88f9a7",
    TokenV2,
    { gasPrice: gas }
  );

  await mc.deployed();
  console.log("Contract Upgraded:", mc.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
