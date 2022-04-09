import React, { useState, useEffect, useCallback } from 'react'
import AddressesList from './Confirm/AddressesList';
import { Center, Box, useColorModeValue, 
    Button, Table, Thead, SimpleGrid,
    Tr, Th, Heading, TableCaption, VStack, 
    useToast, chakra, Link
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from 'contexts/AuthContext';
import { ethers } from 'ethers';

import bulkSender_abi from "abi/bulkSender.json"
import nestCoin_abi from "abi/nestCoin.json"
import ApproveSend from './Confirm/ApproveSend';

export default function Confirm() {

    const bg = useColorModeValue("#E5E5E5", "gray.800");
    let navigate = useNavigate();
    const toast = useToast();
    const toastID = 'toast';

    const [ isLoading, setIsLoading ] = useState()
    const [ isApproved, setIsApproved ] = useState(false)
    const [ tokenSymbol, setTokenSymbol ] = useState()
    const [ coinGas, setCoinGas ] = useState()
    const [ contractGas, setContractGas ] = useState()
    const [ isSent, setIsSent ] = useState(false)
    const [ currentPrice, setCurrentPrice ] = useState()

    const { currentAccount, addresses, tokenAddress, amount, isPro, setIsPro, 
        setAmount, setTokenAddress, setAddresses, contractAddr, currentNetwork,
        setContractAddr, setTabIndex, tabIndex
    } = useAuth()

    const getTokenSymbol = useCallback(async() => {
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner(); 
            //connects with the contract
            const tokenContract = new ethers.Contract(tokenAddress, nestCoin_abi, signer);
            console.log({tokenAddress});
            setTokenSymbol(await tokenContract.symbol());
        } catch(err) {
            console.log(err)
        }
    }, [tokenAddress])

    const getCoinGasPrice = useCallback(() => {
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            provider.getGasPrice().then((currentPrice)=> {
                if(addresses) {
                    setCoinGas(addresses.length*21000*ethers.utils.formatUnits(currentPrice, "gwei"))
                }
            })
            
        } catch(err) {
            console.log(err)
        }
    }, [addresses])

    const getContractGasPrice = useCallback(async() => {
        
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner(); 
            let _currentPrice;
            provider.getGasPrice().then((currentprice)=> {
                _currentPrice = ethers.utils.formatUnits(currentprice, "gwei");
                console.log(_currentPrice);
                 setCurrentPrice(_currentPrice);

            })
            console.log(currentPrice);
            //const bulkSender= new ethers.Contract(contractAddr, bulkSender_abi , signer);
            const bulkSender= new ethers.Contract(contractAddr, bulkSender_abi , signer);
            console.log({contractAddr});
            let estimation;
            if(isPro) {
                console.log("First method");
                let _amountArr = []
                let _addressArr = []
                for(let i=0; i<addresses.length; i++) {
                    _amountArr.push(ethers.utils.parseEther(addresses[i][1]))
                    _addressArr.push(addresses[i][0])
                }
                try {
                    console.log(_amountArr);
                    console.log(_addressArr);
                    console.log(_currentPrice);
                    estimation = await bulkSender.estimateGas.AirdropDifferentValue( _addressArr, _amountArr)
                    setContractGas(parseInt(estimation["_hex"], 16)*currentPrice)
                } catch(err) {
                    console.log(err)
                }
            } else {
                console.log("second method");
                try {
                    console.log(" amount ".amount);
                    estimation = await bulkSender.estimateGas.AirdropSameValue(addresses, ethers.utils.parseEther((amount)).toString());
                    setContractGas(parseInt(estimation["_hex"], 16)*currentPrice)
                } catch(err) {
                    console.log(err)
                }
            }
            console.log("estimation".estimation);
            console.log(parseInt(estimation["_hex"], 16))
        } catch(err) {
            console.log(err)
        }
    }, [addresses, amount, contractAddr, tokenAddress, isPro, tabIndex])

    useEffect(() => {
        if(currentNetwork === 42 ) {//KOvan network we would set our contract address
            setContractAddr("0x1828f6d9Bd8142599757d1550dfb10F17714336d")
            setTokenAddress("0x0747cd400045Db476b12312E61AF9194CA629b84");
        } else setContractAddr()
        if(tabIndex===1) {
            getCoinGasPrice()
            getContractGasPrice()
        }
        if(tokenAddress) {
            getTokenSymbol()
        }
    }, [currentNetwork, setContractAddr, getTokenSymbol, tokenAddress, 
        getContractGasPrice, getCoinGasPrice, tabIndex])

    const handleBackClick = () => {
        setIsPro(false)
        setAddresses()
        setAmount()
        setTokenAddress()
        setTabIndex(0)
        navigate("/", { replace: false })
    }

    const sendTx = async() => {
        console.log("****************************************************");
        if(!currentAccount) {
            toast({
                toastID,
                title: 'No Account Found!',
                description: "Please connect with your wallet.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        // 
        // if(currentNetwork!==56 && currentNetwork!==128 && currentNetwork!==97) {
        //     toast({
        //         toastID,
        //         title: 'Incorrect Network detected!',
        //         description: "Please switch to supported networks.",
        //         status: 'error',
        //         duration: 3000,
        //         isClosable: true,
        //     })
        //     return;
        // }
        if(!amount) {
            toast({
                toastID,
                title: 'No amount detected',
                description: "Please input correct values",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        console.log("I am here");
        setIsLoading(true)
        try {
            const { ethereum } = window; //injected by metamask
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner(); 
            //connects with the contract
            const bulkSenderContract= new ethers.Contract(contractAddr, bulkSender_abi , signer);
            console.log(bulkSenderContract);
            if(isPro) {
                
                console.log(amount);
                const options = {value: ethers.utils.parseEther((amount).toString())}
                
                console.log(options);
                let _amountArr = []
                let _addressArr = []
                for(let i=0; i<addresses.length; i++) {
                    _amountArr.push(ethers.utils.parseEther(addresses[i][1]));
                    _addressArr.push(ethers.utils.getAddress(addresses[i][0]));
                }
                console.log(_addressArr);
                console.log(_amountArr);
                console.log(options);
                await bulkSenderContract.AirdropDifferentValue(_addressArr, _amountArr,options)
            } else {
                console.log(amount);
                const options = {value: ethers.utils.parseEther((amount*addresses.length).toString())}
                console.log((amount).toString());
                console.log(addresses);
                await bulkSenderContract.AirdropSameValue(addresses, ethers.utils.parseEther((amount).toString()));
            }
            setTimeout(() => {
                setIsSent(true)
            }, 5000);
            toast({
                toastID,
                title: 'Transaction Submitted',
                description: "Please check explorer.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch(err) {
            toast({
                toastID,
                title: 'UnAuthorized',
                description: "You are not Authorized to perform this operation.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            console.log(err)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 5000);
        }
    }


    return (
    <Center bg={bg} h="90vh">
        <Box rounded="xl" shadow="lg" bg={useColorModeValue("white", "gray.700")} p="4" w="80vw">
            <Button variant="ghost" m="1" leftIcon={<ArrowBackIcon />} onClick={handleBackClick}>
                Back
            </Button>
            <Table variant='simple' size="sm">
                <TableCaption placement='top'>
                    <Heading as="h2" size="md" color={useColorModeValue("gray.600", "gray.400")}>DETAILS</Heading>
                </TableCaption>
                <Thead>
                    <Tr>
                    <Th>Address</Th>
                    <Th isNumeric>Amount</Th>
                    </Tr>
                </Thead>
                <AddressesList />
            </Table>
            <Center mt="4">
                <VStack spacing="4">
                    <Heading as="h2" size="md" my="2" color={useColorModeValue("gray.600", "gray.400")}>SUMMARY</Heading>
                    {tokenAddress ?
                    <>
                    <Heading as="h2" size="sm" my="2">
                        Token Contract Address:
                    </Heading>
                    <chakra.h2>
                        <Link href={"https://kovan.etherscan.com/address/"+tokenAddress} isExternal>
                        {tokenAddress.substring(0, 5)+"..."+tokenAddress.substring(36, 42)}
                        </Link>
                        <ExternalLinkIcon ml="1"/>
                    </chakra.h2>
                    </>
                    
                    :
                    <></>
                    }
                    
                    <SimpleGrid columns={[1, null, 2]} spacing={4}>
                        <Box rounded="xl" bg='brand.200' height='80px' p="4">
                            Total Number Of Addresses
                            <Center>{addresses ? addresses.length : ""}</Center>    
                        </Box>
                        <Box rounded="xl" bg='brand.200' height='80px' p="4">
                            <Center>
                            Total Amount to be Sent
                            </Center>
                            <Center>{isPro 
                                ? tokenAddress ? amount + " " + tokenSymbol :  amount
                                : addresses 
                                ? tokenAddress ? (addresses.length*10*amount)/10 + " " + tokenSymbol : (addresses.length*10*amount)/10
                                : ""}
                            </Center>
                        </Box>
                        {tabIndex === 1 ?
                        <></>
                        :
                        <>
                            {/* <Box rounded="xl" bg='brand.200' height='80px' p="4">
                                <Center>
                                Est. Total Transaction Cost
                                </Center>
                                <Center>
                                    { contractGas } gwei 
                                </Center>
                            </Box>
                            <Box rounded="xl" bg='brand.200' height='80px' p="4">
                                <Center>
                                Cost Decreased By
                                </Center>
                                <Center>
                                    {contractGas ? Math.round(((coinGas-contractGas)/coinGas)*100)+" %" : ""}
                                </Center>
                            </Box> */}
                        </>
                        }
                        
                    </SimpleGrid>
                    {tokenAddress ?
                    true ?
                    <Button bg="brand.100" color="white"
                    size="md"
                    _hover={{
                        backgroundColor: "brand.200"
                    }}
                    
                    isLoading={isLoading}
                    onClick={sendTx}
                    >
                        SEND
                    </Button>
                    :
                    <Button bg="brand.100" color="white"
                    size="md"
                    _hover={{
                        backgroundColor: "brand.200"
                    }}
                     onClick={sendTx}
                    isLoading={isLoading}
                    >
                        SEND
                    </Button>
                    :
                    <Button bg="brand.100" color="white"
                    size="md"
                    _hover={{
                        backgroundColor: "brand.200"
                    }}
                    onClick={sendTx}
                    isLoading={isLoading}
                    isDisabled={isSent}
                    >
                        SEND
                    </Button>
                    }
                    {/* {
                    <ApproveSend isApproved={isApproved} isSent={isSent}/>
                    } */}
                </VStack>
            </Center>
        </Box>
    </Center>
  )
}
