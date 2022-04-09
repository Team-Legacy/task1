import React, { useEffect } from "react";
import Home from "views/Home";

import { useAuth } from "contexts/AuthContext";

function App() {

  const { setCurrentAccount, setCurrentNetwork, 
    currentNetwork, setContractAddr
  } = useAuth()

  useEffect(() => {

    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 4))
        
        window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log(accounts[0])
          setCurrentAccount(accounts[0]);
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 4))
          window.location.reload()
          console.log(chainId);
        })
      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();

  }, [setCurrentAccount, setCurrentNetwork, setContractAddr, currentNetwork]);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
