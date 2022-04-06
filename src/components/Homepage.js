import { InfoOutlineIcon } from '@chakra-ui/icons';
import HomeImage from "assets/undraw_nakamoto_-2-iv6 .svg";
import SupportedNetworks from './Home/SupportedNetworks';

import {
  Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    // ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    useToast,
  } from '@chakra-ui/react';
import Addresses from './Home/FormTabs/Addresses';
import Amounts from './Home/FormTabs/Amounts';
import Token from './Home/FormTabs/Token';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import convertStringAmountAddrToArr from 'utils/convertStringAmountAddrToArr';
import convertStringAddrToArr from 'utils/convertStringAddrToArr';

  
  export default function Homepage() {
    // const bg = useColorModeValue("#E5E5E5", "gray.800");
    let navigate = useNavigate();
    const toast = useToast()

    const { amount, tokenAddress, addresses, setAddresses, 
        currentAccount, isPro, setIsPro, tabIndex, setTabIndex,
        currentNetwork
    } = useAuth()

    const changePro = () => {
        setIsPro(!isPro)
    }

    const confirm = () => {
        if(!currentAccount) {
            toast({
                title: 'No Account Found!',
                description: "Please connect with your wallet.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        if(!isPro && !amount) {
            toast({
                title: 'No Amount detected',
                description: "Please add correct amount.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        if(!isPro && amount <= 0 ) {
            toast({
                title: 'Incorrect Amount detected',
                description: "Amount can't be negative.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        
        if(tabIndex === 1 && tokenAddress.length!==42) {
            toast({
                title: 'Incorrect Token Address detected',
                description: "Please enter correct address",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        
        if(!addresses || addresses.length===0) {
            toast({
                title: 'Incorrect Addresses detected!',
                description: "Please enter correct addresses.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        if(!isPro && typeof(addresses)==="string") {
            setAddresses(convertStringAddrToArr(addresses))
        }

        if(isPro && typeof(addresses)==="string") {
            setAddresses(convertStringAmountAddrToArr(addresses))
        }
        
        if(currentNetwork !== 56 && currentNetwork !==97 && currentNetwork !== 128) {
            toast({
                title: 'Unsupported Network detected!',
                description: "Please switch to supported network.",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        navigate("/confirm", { replace: false })
    }

    const handleTabChange = index => {
        setTabIndex(index)
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={6} w={'full'} maxW={'lg'}>
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
              <Text color={'green.400'} as={'span'}>
              Harness the
              </Text>{' '}
              <br />{' '}
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: useBreakpointValue({ base: '20%', md: '30%' }),
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'green.400',
                  zIndex: -1,
                }}>
                Power of WEB3
              </Text>
              {/* <br />{' '} */}
              
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
            A system that allows users to batch transactions together so they can distribute their "currency" as quickly and efficiently as possible.
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button 
              bg="green.700" color="white" 
              size="md" onClick={onOpen}
              _hover={{
                backgroundColor: "green.600"
              }}
            >
                Claim Reward
              </Button>
              {/* <Button rounded={'full'} onClick={onOpen}>How It Works</Button> */}
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={HomeImage}
          />
        </Flex>
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Center h="90vh" mt="4">
            <Box mt="-20" px="2" pb="4" rounded="xl" shadow="lg" bg={useColorModeValue("white", "gray.700")} w={{base:'90vw', md:"60vw"}} h="80vh">
              <Tabs isFitted variant='unstyled' onChange={(index) => handleTabChange(index)}>
              <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                <GridItem colSpan={4}>
                    <TabList  mx={4} mt="8" p={2} bg="brand.300" rounded="xl" w={{base:"92.5%", md:"60%"}} color="black">
                    <Tab _selected={{ color: 'black', bg: 'brand.200' }} 
                        _focus={{ outline: "none" }} rounded="lg">
                        Send {
                        currentNetwork === 56 || currentNetwork ===97 ? "BNB"
                        :  
                        currentNetwork === 128 ? "HT"
                        :
                        currentNetwork === 1
                        ? "ETH" : ""}
                    </Tab>
                    <Tab _selected={{ color: 'black', bg: 'brand.200' }}
                        _focus={{ outline: "none" }} rounded="lg">
                        Send Tokens
                    </Tab>
                    </TabList>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl display='flex' alignItems='flex-end' justifyContent='flex-end' mt="8" pr="4">
                  <FormLabel htmlFor='pro' mb='0'>
                      PRO
                      <Tooltip label='In Pro Mode, you can set different amounts of token to be sent to each address' 
                      fontSize='sm' rounded="md">
                          <InfoOutlineIcon ml="2"/>
                      </Tooltip>
                  </FormLabel>
                  <Switch id='pro' onChange={changePro}/>
                  </FormControl>
                </GridItem>
              </Grid>
              <TabPanels>
                <TabPanel>
                    { isPro
                    ? <></>
                    : <Amounts />}
                    <Addresses />
                </TabPanel>
                <TabPanel>
                    <Token />
                    { isPro
                    ? <></>
                    : <Amounts />}
                    <Addresses />
                </TabPanel>
              </TabPanels>
              </Tabs>
              <Center>
                  <Button bg="brand.100" color="white" 
                  size="lg"
                  my="20px"
                  _hover={{
                      backgroundColor: "brand.200"
                  }}
                  onClick={confirm}
                  >
                      NEXT
                  </Button>
              </Center>
            </Box>
          </Center>
          <SupportedNetworks />
          </ModalBody>

          {/* <ModalFooter>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      </Stack>
    );
  }