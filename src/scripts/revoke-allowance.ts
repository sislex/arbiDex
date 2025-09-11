// import { ethers } from "hardhat";
//
// async function main() {
//   const { USDC, DEPLOYED_CONTRACT_ADDRESS } = process.env;
//   if (!USDC || !DEPLOYED_CONTRACT_ADDRESS) {
//     throw new Error("Missing USDC or DEPLOYED_CONTRACT_ADDRESS in .env");
//   }
//
//   const [signer] = await ethers.getSigners();
//   console.log("Owner:", await signer.getAddress());
//
//   const erc20 = await ethers.getContractAt("IERC20", USDC);
//
//   console.log(`Revoking allowance for ${DEPLOYED_CONTRACT_ADDRESS}...`);
//   const tx = await erc20.approve(DEPLOYED_CONTRACT_ADDRESS, 0);
//   console.log("tx hash:", tx.hash);
//
//   await tx.wait();
//
//   const allowance = await erc20.allowance(await signer.getAddress(), DEPLOYED_CONTRACT_ADDRESS);
//   console.log("Allowance now:", allowance.toString());
// }
//
// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
