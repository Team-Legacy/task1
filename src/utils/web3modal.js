import Web3Modal from "web3modal";

const providerOptions = {

};

const web3Modal = new Web3Modal({
  providerOptions:{}, // required
  network: "kovan", // optional
  cacheProvider: true, // optional
  disableInjectedProvider: false,
});

export default web3Modal;

