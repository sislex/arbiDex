import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { DexQuoteProvider } from './dex-quote.provider';
import { UniswapV3QuoteProvider } from './univ3-quote.provider';
import { SushiV2QuoteProvider } from './sushiv2-quote.provider';

type CreateUniOpts = {
  dex: 'UniswapV3';
  rpcUrl: string;
  chainId: number;
  quoterAddr: string;
  factoryAddr: string;
};

type CreateSushiOpts = {
  dex: 'SushiV2';
  rpcUrl: string;
  chainId: number;
  routerAddr: string;
};

type CreateOpts = CreateUniOpts | CreateSushiOpts;

@Injectable()
export class DexFactoryService {
  create(opts: CreateOpts): DexQuoteProvider {
    const provider = new ethers.JsonRpcProvider(opts.rpcUrl, {
      chainId: opts.chainId,
      name: 'evm',
    });

    if (opts.dex === 'UniswapV3') {
      const { quoterAddr, factoryAddr } = opts;
      if (!quoterAddr || !factoryAddr)
        throw new Error('UniswapV3 requires quoterAddr & factoryAddr');
      return new UniswapV3QuoteProvider(provider, quoterAddr, factoryAddr);
    }

    if (opts.dex === 'SushiV2') {
      const { routerAddr } = opts;
      if (!routerAddr) throw new Error('SushiV2 requires routerAddr');
      return new SushiV2QuoteProvider(provider, routerAddr);
    }

    throw new Error(`Unsupported dex ${(opts as any).dex}`);
  }
}
