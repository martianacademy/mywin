const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gas = await ethers.provider.getGasPrice();

  console.log("Gas price is ", gas);

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  const formatedBalance = ethers.utils.formatEther(balance);

  console.log("Account balance:", formatedBalance.toString(), "ETH");

  const TokenV2 = await ethers.getContractFactory("StakingV2Upgradable");
  const mc = await upgrades.upgradeProxy(
    "0xD021F0c34C02Ec2Bf6D80905c23bafad0482d1ea",
    TokenV2,
    { gasPrice: gas }
  );

  const mc2 = await upgrades.upgradeProxy(
    "0xd9756f304c55a7e01c07b5296D21112072260aA5",
    TokenV2,
    { gasPrice: gas }
  );

  await mc.deployed();
  console.log("Contract Upgraded:", mc.address);
  await mc2.deployed();
  console.log("Contract Upgraded:", mc2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
