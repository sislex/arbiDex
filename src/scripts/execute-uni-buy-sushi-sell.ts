// import { ethers } from "hardhat";
//
// async function main() {
//   const { DEPLOYED_CONTRACT_ADDRESS, USDC, WETH } = process.env;
//   if (!DEPLOYED_CONTRACT_ADDRESS || !USDC || !WETH) throw new Error("Missing envs");
//
//   const [owner] = await ethers.getSigners();
//   const c = await ethers.getContractAt("ArbiDexExecutor", DEPLOYED_CONTRACT_ADDRESS, owner);
//
//   // параметры сделки (минимальные для теста)
//   const amountInUSDC = ethers.parseUnits("5", 6);   // 5 USDC
//   const uniFee: number = 3000;                      // 0.3%
//   const uniMinOutWETH = 0n;                         // для теста (лучше ставить реальный мин. выход)
//   const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // +10 минут
//
//   // Sushi path: [WETH, USDC]
//   const sushiPath = [WETH, USDC];
//   const sushiMinOutUSDC = 0n; // для теста; на практике ставь защиту от проскальзывания
//
//   console.log("Calling executeUniBuy_SushiSell ...");
//   const tx = await c.executeUniBuy_SushiSell(
//     amountInUSDC,
//     uniFee,
//     uniMinOutWETH,
//     sushiPath,
//     sushiMinOutUSDC,
//     deadline,
//     0n, // minProfitUSDC — для теста можно 0, но лучше >0
//     { gasLimit: 2_000_000 }
//   );
//   console.log("tx hash:", tx.hash);
//   const rc = await tx.wait();
//   console.log("status:", rc!.status);
// }
//
// main().catch((e) => (console.error(e), process.exit(1)));
