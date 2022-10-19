# Install

yarn install

# Install

To run test for player as single contract: yarn testPlayer
To run test for player as part of Diamond: yarn testDiamondPlayer




forge test --fork-url https://eth-mainnet.alchemyapi.io/v2/a1H2bvHzNVPb9GP63_v-GpA0KVhbI95Z -vvvvv --match-contract Sw --match-test testSwapSingleHopExactAmountIn
forge test --fork-url https://eth-mainnet.alchemyapi.io/v2/a1H2bvHzNVPb9GP63_v-GpA0KVhbI95Z   --fork-block-number 15756971 --match-contract Sw --match-test testSwapSingleHopExactAmountIn

test player deposit :  yarn forge2

VRF on hardhat
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers
add helper-hardhat-config.js
add contracts/test/VRFCoordinatorV2Mock.sol
yarn add @chainlink/contracts --dev