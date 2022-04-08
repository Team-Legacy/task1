// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account: ' + deployer.address);
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Nestcoin = await hre.ethers.getContractFactory("Nestcoin");
  // const nestcoin = await Nestcoin.deploy();

  // await nestcoin.deployed();

  // console.log("Nestcoin deployed to:", nestcoin.address);

  // sleep(10000);

  const BulkSender = await hre.ethers.getContractFactory("BulkSender");
  const bulksender = await BulkSender.deploy("0x0747cd400045Db476b12312E61AF9194CA629b84");

  

  await bulksender.deployed();

  console.log("BulkSender deployed to:", bulksender.address);


  // ToDo: change address to your frontend address vvvv
  console.log("\n 🤹  Sending ownership to frontend address...\n");
  const ownershipTransaction = await bulksender.transferOwnership(
    "0x6788D8cAAF0A989bD940b335FC89Fd8696E58744"
  );
  console.log("\n    ✅ confirming...\n");
  const ownershipResult = await ownershipTransaction.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}