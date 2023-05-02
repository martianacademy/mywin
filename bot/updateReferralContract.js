var ReferralInterface = require('../src/contracts/artifacts/contracts/ReferralV3Upgradeable.sol/ReferralV3Upgradeable.json');
var ethers = require('ethers');
var crypto = require('crypto');

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.blockchain.myveex.com'
);

const walletSigner = new ethers.Wallet(process.env.PRIVATE_KEY);
const referralContractAddress = '0xf72BBf777076BBfE2f779EEC69Eee9578399e353';
const ReferralContract = new ethers.Contract(
  referralContractAddress,
  ReferralInterface.abi,
  provider
);

let _from = 14640;
let _count = 80;
let _to = _from + _count;

const updateFunction = async () => {
  const signer = walletSigner.connect(provider);
  const ReferralContractWithSigner = ReferralContract.connect(signer);

  // const companyTurnover = await ReferralContractWithSigner.companyTurnoverTimeLimit();
  // console.log(companyTurnover)

  //   let value = Math.floor(Math.random() * 1000000000 + 1000000);

  //   const tx = await signer.sendTransaction({
  //     to: "0xD79100b85aE41F2f141a53dF0983d10566a53b4b",
  //     value: value,
  //   });

  console.log('From', _from);

  const tx = await ReferralContractWithSigner.addTeam(`${_from}`, `${_to}`);
  console.log('To', _to);

  await tx.wait().then(console.log('Success'),
  _from = _to,
  _to = _from + _count).catch(console.log('Error'));
};

provider.on('block', () => {
  console.log('new block');
  console.log('Sending Transaction');
  updateFunction()
    .then(
     console.log("Transaction Submitted")
    )
    .catch(() => {
      console.log('Errror running again');
      updateFunction();
    });
});
