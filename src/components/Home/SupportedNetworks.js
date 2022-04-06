import {
    Box, Container, Link, Stack, useColorModeValue, chakra, Image
} from '@chakra-ui/react';
import BNBLogo from "assets/bnb-logo.svg"
import HECOLogo from "assets/heco-logo.png"

export default function SupportedNetworks() {
    return (
        <Box
        bg={useColorModeValue('#E5E5E5', 'gray.800')}
        color={useColorModeValue('gray.700', 'gray.200')}
        pb="8">
        <Container
            as={Stack}
            maxW={'6xl'}
            py={{base: "20", sm: "0"}}
            spacing={4}
            justify={'center'}
            align={'center'}
            mt="4">
            <chakra.p
                fontSize="xl"
                lineHeight="8"
                fontWeight="extrabold"
                letterSpacing="tight"
                color={useColorModeValue("gray.900")}
            >
                Supported Networks
            </chakra.p>
            <Stack direction={'row'} spacing={6}>
            <Link href="https://www.binance.com/en" isExternal>
                <Image mt="4" h="40px" src={BNBLogo}/>
            </Link>
            <Link href="https://www.hecochain.com/en-us/" isExternal>
                <Image mt="4" h="40px" src={HECOLogo}/>
            </Link>
            </Stack>
        </Container>
        </Box>
    );
}