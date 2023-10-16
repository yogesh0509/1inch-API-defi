import React, { useState, useEffect } from 'react';
import { useNetwork, useBalance } from 'wagmi'
import Image from 'next/image';

import ConnectWallet from '../components/Button/ConnectWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Index() {
  const [inputAmount, setInputAmount] = useState(10);
  const [outputAmount, setOutputAmount] = useState(0);
  const [selectedTokenSell, setSelectedTokenSell] = useState();
  const [selectedTokenBuy, setSelectedTokenBuy] = useState();
  const [tokenOptions, settokenOptions] = useState([])
  const [tokens, settokens] = useState()
  const { chain } = useNetwork()


  useEffect(() => {
    console.log(chain)
    handleGetRequest()
  }, [settokenOptions, settokens, chain])

  const handleSwap = () => {
    // Implement swap logic here
  };

  const handleGetRequest = async () => {
    try {
      const response = await fetch('/api/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        settokens(responseData.tokens)
        setSelectedTokenSell(responseData.tokens[Object.keys(responseData.tokens)[0]])
        setSelectedTokenBuy(responseData.tokens[Object.keys(responseData.tokens)[1]])

        const optionArray = [];

        for (const token in responseData.tokens) {
          if (responseData.tokens.hasOwnProperty(token)) {
            optionArray.push(`${token}: ${responseData.tokens[token].symbol}`);
          }
        }
        const optionObject = optionArray.map(item => {
          const [key, value] = item.split(': '); // Split the string into key and value
          return { [key]: value };
        });
        settokenOptions(optionObject)

      } else {
        console.log('Error handling POST request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96 relative">
        <h5 className="font-semibold mb-4">Swap</h5>

        {tokenOptions && tokens && selectedTokenBuy && selectedTokenSell
          ? <div className="mb-4">
            <div className="border border-gray-300 rounded mb-6 p-4">
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
                  className="px-2 py-1 rounded focus:outline-none focus:ring w-16"
                >
                  {tokenOptions.map((token) => (
                    <option key={Object.keys(token)[0]} data-key={Object.keys(token)[0]} value={Object.values(token)[0]}>
                      {Object.values(token)[0]}
                    </option>
                  ))}
                </select>
                <div className="flex-grow"></div>
                <p className="text-lg font-semibold">{inputAmount} {selectedTokenSell.symbol}</p>
              </div>
              {/* Arrow icon from Box 1 to Box 2 */}
              <div className="absolute top-100% left-1/2 transform -translate-x-1/2">
                <FontAwesomeIcon icon={faArrowDown} size="2x" color="gray" />
              </div>
            </div>

            <div className="border border-gray-300 rounded mb-6 p-4">
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
                  className="px-2 py-1 rounded focus:outline-none focus:ring w-16"
                >
                  {tokenOptions.map((token) => (
                    <option key={Object.keys(token)[0]} data-key={Object.keys(token)[0]} value={Object.values(token)[0]}>
                      {Object.values(token)[0]}
                    </option>
                  ))}
                </select>
                <div className="flex-grow"></div>
                <p className="text-lg font-semibold">{outputAmount} {selectedTokenBuy.symbol}</p>
              </div>
            </div>
          </div>
          : <></>
        }

        <div
          onClick={handleSwap}
          className="w-full p-2 rounded focus:outline-none focus:ring"
        >
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
