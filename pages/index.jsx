import React, { useState, useEffect } from 'react'
import { useNetwork, useBalance, useAccount } from 'wagmi'
import { ethers } from 'ethers'
import Image from 'next/image'

import ConnectWallet from '../components/Button/ConnectWallet'
import toast from "react-hot-toast"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

export default function Index() {
  const [outputAmount, setOutputAmount] = useState('0')
  const [selectedTokenSell, setSelectedTokenSell] = useState()
  const [selectedTokenBuy, setSelectedTokenBuy] = useState()
  const [tokenOptions, settokenOptions] = useState([])
  const [tokens, settokens] = useState()
  const [gasfees, setgasfees] = useState()
  const [isAllowance, setallowance] = useState(true)
  const { chain } = useNetwork()
  const { address } = useAccount()

  const balance = useBalance({
    address: address,
    token: selectedTokenSell ? selectedTokenSell.address : "",
  })
  const inputAmount = selectedTokenSell ? balance.data.formatted : "0"
  console.log(balance.data)

  useEffect(() => {
    handleGetRequest()
    quotePrice()
    // checkallowance()
  }, [settokenOptions, settokens, chain])

  useEffect(() => {
    quotePrice()
    // checkallowance()
  }, [selectedTokenBuy, selectedTokenSell])

  const handleSwap = async () => {
    toast.dismiss("connecting")
    toast.loading("Connecting with contract", {
      id: "connect",
    })

    try {
      const response = await fetch(`/api/swap?chainId=${chain.id}&src=${selectedTokenSell.address}&dst=${selectedTokenBuy.address}&amount=${inputAmount}&from=${address}&slippage=${1}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        toast.dismiss("connect");
        toast.success("Transaction Completed!!")

      } else {
        console.log('Error handling POST request')
        toast.dismiss("connect");
        const err = await response.json()
        toast.error(err.description)
      }
    } catch (error) {
      console.log('Error:', error)
      toast.dismiss("connect");
      toast.error("Error connecting with contract")
    }
  }

  const handleApprovtx = async () => {
    toast.dismiss("connecting")
    toast.loading("Connecting with contract", {
      id: "connect",
    })

    try {
      const response = await fetch(`/api/approve?chainId=${chain.id}&tokenAddress=${selectedTokenSell.address}&amount=${inputAmount}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(await response.json())
      if (response.ok) {
        toast.dismiss("connect");
        toast.success("Transaction Completed!!")

      } else {
        console.log('Error handling POST request')
        toast.dismiss("connect");
        const err = await response.json()
        toast.error(err.description)
      }
    } catch (error) {
      console.log('Error:', error)
      toast.dismiss("connect");
      toast.error("Error connecting with contract")
    }
  }

  const quotePrice = async () => {
    if (selectedTokenSell && selectedTokenBuy) {
      try {
        const response = await fetch(`/api/quote?chainId=${chain.id}&src=${selectedTokenSell.address}&dst=${selectedTokenBuy.address}&amount=${inputAmount}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const responseData = await response.json()
        if (response.ok) {
          setOutputAmount(responseData.toAmount)
        } else {
          console.log(responseData)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  // const checkallowance = async () => {
  //   try {
  //     const response = await fetch(`/api/allowance?chainId=${chain.id}&tokenAddress=${selectedTokenSell.address}&walletAddress=${address}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     })

  //     if (response.ok) {
  //       const responseData = await response.json()
  //       if (responseData.allowance <= inputAmount) {
  //         setallowance(false)
  //       }
  //       else {
  //         setallowance(true)
  //       }
  //     } else {
  //       console.log('Error handling POST request')
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  const handleGetRequest = async () => {
    console.log("hello")
    try {
      const response = await fetch(`/api/token?chainId=${chain.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const responseData = await response.json()
        settokens(responseData.tokens)
        setSelectedTokenSell(responseData.tokens[Object.keys(responseData.tokens)[0]])
        setSelectedTokenBuy(responseData.tokens[Object.keys(responseData.tokens)[1]])

        const optionArray = []

        for (const token in responseData.tokens) {
          if (responseData.tokens.hasOwnProperty(token)) {
            optionArray.push(`${token}: ${responseData.tokens[token].symbol}`)
          }
        }
        const optionObject = optionArray.map(item => {
          const [key, value] = item.split(': ')
          return { [key]: value }
        })
        settokenOptions(optionObject)

      } else {
        console.log('Error handling POST request')
      }
    } catch (error) {
      console.error('Error:', error)
    }

    try {
      const response = await fetch(`/api/gasfees?chainId=${chain.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const responseData = await response.json()
      if (response.ok) {
        setgasfees(responseData)

      } else {
        console.log(responseData)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg relative">
        <h5 className="font-semibold mb-4">Swap</h5>
        {console.log(selectedTokenSell, selectedTokenBuy)}

        {tokenOptions && tokens && selectedTokenBuy && selectedTokenSell && gasfees
          ? <div className="mb-4">
            <div className="border border-gray-300 rounded-lg mb-6 p-4">
              <h3 className="text-sm text-gray-600">You sell</h3>
              <div className="mb-4 flex items-center">
                <Image
                  src={selectedTokenSell.logoURI}
                  alt={selectedTokenSell.symbol}
                  width={30}
                  height={30}
                />
                <select
                  value={selectedTokenSell.symbol}
                  onChange={(e) => setSelectedTokenSell(tokens[e.target.selectedOptions[0].getAttribute('data-key')])}
                  className="px-1 rounded-lg focus:outline-none focus:ring w-18"
                >
                  {tokenOptions.map((token) => (
                    <option key={Object.keys(token)[0]} data-key={Object.keys(token)[0]} value={Object.values(token)[0]}>
                      {Object.values(token)[0]}
                    </option>
                  ))}
                </select>
                <div className="flex-grow"></div>
                <p className="text-lg font-semibold">{inputAmount}</p>
              </div>
              {/* Arrow icon from Box 1 to Box 2 */}
              <div className="absolute top-100% left-1/2 transform -translate-x-1/2">
                <FontAwesomeIcon icon={faArrowDown} size="2x" color="gray" />
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg mb-6 p-4">
              <h3 className="text-sm text-gray-600">You buy</h3>
              <div className="mb-4 flex items-center">
                <Image
                  src={selectedTokenBuy.logoURI}
                  alt={selectedTokenBuy.symbol}
                  width={30}
                  height={30}
                />
                <select
                  value={selectedTokenBuy.symbol}
                  onChange={(e) => setSelectedTokenBuy(tokens[e.target.selectedOptions[0].getAttribute('data-key')])}
                  className="px-1 rounded-lg focus:outline-none focus:ring w-18"
                >
                  {tokenOptions.map((token) => (
                    <option key={Object.keys(token)[0]} data-key={Object.keys(token)[0]} value={Object.values(token)[0]}>
                      {Object.values(token)[0]}
                    </option>
                  ))}
                </select>
                <div className="flex-grow"></div>
                <p className="text-lg font-semibold">{outputAmount}</p>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg mb-6 p-4">
              <h3 className="text-sm text-gray-600">Gas fee = {ethers.utils.formatEther(gasfees, "ether")} ETH</h3>
            </div>
          </div>
          : <></>
        }
        <div className="flex items-center">
          <div className="w-1/2 p-2 rounded-lg focus:outline-none focus:ring">
            <ConnectWallet />
          </div>
          {isAllowance
            ?
            <button className="bg-red-500 focus:outline-none focus:ring text-white py-2 px-4 rounded-lg" onClick={handleSwap} >
              SWAP
            </button>
            :
            <button className="bg-red-500 focus:outline-none focus:ring text-white py-2 px-4 rounded-lg" onClick={handleApprovtx} >
              Insufficient allowance!!
            </button>
          }
        </div>
      </div>
    </div>
  )
}

// wallet amount validation