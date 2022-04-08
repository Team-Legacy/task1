const { utils } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");

require("hardhat-deploy");

require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { isAddress, getAddress, formatUnits, parseUnits } = utils;



module.exports = {
  defaultNetwork: "kovan",
  networks: {
    hardhat: {
    },
    kovan: {
      url: "https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad",
      accounts: ["15d646881200aac55afef3e4a70c4c89e2a4545f6e7e4d824e074e42f0737018"],
    }
  },
  etherscan: {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  apiKey: "TG4CX6ZJEU5VRFM9QRH23FD1DPNAPTIN5B"
  },
  solidity: "0.8.13",
};
