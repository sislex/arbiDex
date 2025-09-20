import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { DexQuoteProvider } from './dex-quote.provider';
import { UniswapV3QuoteProvider } from './univ3-quote.provider';
import { SushiV2QuoteProvider } from './sushiv2-quote.provider';

@Injectable()
export class DexQuoteFactory {
  create(opts: {
    dex: string;
    rpcUrl: string;
    chainId: number;
    quoterAddr?: string;
    factoryAddr?: string;
    routerAddr?: string;
  }): DexQuoteProvider {
    const provider = new ethers.JsonRpcProvider(opts.rpcUrl, {
      chainId: opts.chainId,
      name: 'evm',
    });

    if (opts.dex === 'UniswapV3') {
      if (!opts.quoterAddr || !opts.factoryAddr)
        throw new Error('UniswapV3 requires quoterAddr & factoryAddr');
      return new UniswapV3QuoteProvider(
        provider,
        opts.quoterAddr,
        opts.factoryAddr,
      );
    }

    if (opts.dex === 'SushiV2') {
      if (!opts.routerAddr) throw new Error('SushiV2 requires routerAddr');
      return new SushiV2QuoteProvider(provider, opts.routerAddr);
    }

    throw new Error(`Unsupported dex: ${opts.dex}`);
  }
}
