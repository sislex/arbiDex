// import { ethers } from 'hardhat';
//
// async function main() {
//   const { USDC, DEPLOYED_CONTRACT_ADDRESS } = process.env;
//   if (!USDC || !DEPLOYED_CONTRACT_ADDRESS) {
//     throw new Error("Missing USDC or DEPLOYED_CONTRACT_ADDRESS in .env");
//   }
//
//   const [signer] = await ethers.getSigners();
//   const owner = await signer.getAddress();
//
//   const erc20 = await ethers.getContractAt("IERC20", USDC);
//
//   const allowance = await erc20.allowance(owner, DEPLOYED_CONTRACT_ADDRESS);
//   console.log(`Allowance for contract ${DEPLOYED_CONTRACT_ADDRESS}: ${allowance.toString()}`);
// }
//
// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
