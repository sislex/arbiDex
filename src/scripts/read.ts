// // scripts/read.ts
// import { ethers } from "hardhat";
//
// async function main() {
//   const addr = process.env.DEPLOYED_CONTRACT_ADDRESS!;
//   const c = await ethers.getContractAt("ArbiDexExecutor", addr);
//   console.log("owner:", await c.owner());
//   console.log("USDC :", await c.USDC());
//   console.log("WETH :", await c.WETH());
//   console.log("Sushi:", await c.sushiV2());
//   console.log("UniV3:", await c.uniV3Router());
// }
// main().catch(e => (console.error(e), process.exit(1)));
