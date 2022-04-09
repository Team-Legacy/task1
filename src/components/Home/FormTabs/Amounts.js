import React, { useEffect, useCallback } from 'react'
import {
    FormControl, FormLabel, FormHelperText, InputGroup,
    Input, InputRightAddon
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useAuth } from 'contexts/AuthContext'

export default function Amounts() {

  const { setAmount} = useAuth();
   

  const handleChange = (e) => {
    console.log(e.target.value);
    setAmount(e.target.value)
  }

  return (
    <>
    <FormControl mt="4">
        <FormLabel htmlFor='amount'>Amount per Address</FormLabel>
        <InputGroup>
          <Input id='amount' _placeholder={{color: "gray.500"}} onChange={handleChange}
          type='number' color="black" w={{base:'100%', md:"60%"}} backgroundColor="#E5E5E5" placeholder='10' isRequired/>
          
          
        </InputGroup>
    </FormControl>
    </>
  )
}
