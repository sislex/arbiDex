// import { Injectable } from '@nestjs/common';
// import { IAmountAndFeeResult } from './dex-provider.service';
//
// @Injectable()
// export class UniswapQuoteService {
//   async getSellQuote(
//     base: string, // tokenIn
//     quote: string, // tokenOut
//     amountInBase: string, // "0.5"
//     chainId: number,
//     slippageBps = 50,
//   ): Promise<IAmountAndFeeResult | null> {
//     // реализация через quoteExactInput
//   }
//
//   async getBuyQuote(
//     base: string, // tokenOut
//     quote: string, // tokenIn
//     amountOutBase: string, // "0.5"
//     chainId: number,
//     slippageBps = 50,
//   ): Promise<IAmountAndFeeResult | null> {
//     // реализация через quoteExactOutput
//   }
// }
