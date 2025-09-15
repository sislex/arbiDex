import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpportunityService } from './services/opportunity/opportunity.service';
import { Contract, ethers } from 'ethers';
import { DexProviderService } from './services/dex-provider/dex-provider.service';
import { QuotesService } from './db/services/quotes.service';
import { DexFactoryService } from './dex-quote/dex-factory.service';

// helpers
const EXECUTOR_ABI = [
  'function executeSushiBuy_UniSell(uint256 amountInUSDC, address[] sushiPath, uint256 sushiMinOutWETH, uint24 uniFee, uint256 uniMinOutUSDC, uint256 deadline, uint256 minProfitUSDC) external',
  'function executeUniBuy_SushiSell(uint256 amountInUSDC, uint24 uniFee, uint256 uniMinOutWETH, address[] sushiPath, uint256 sushiMinOutUSDC, uint256 deadline, uint256 minProfitUSDC) external',
] as const;

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);

  private readonly pollMs: number;
  private readonly loopNumbers: number;
  private readonly slippageBps: number;
  private readonly deadlineSec: number;
  private readonly amountInWETH: string;

  private provider?: ethers.JsonRpcProvider;
  private signer?: ethers.Wallet;

  private readonly executorAddr!: string;
  private readonly executor: Contract;

  constructor(
    private cfg: ConfigService,
    private opp: OpportunityService,
    private dex: DexProviderService,
    private quotesService: QuotesService,
    private readonly dexFactory: DexFactoryService,
  ) {
    this.pollMs = Number(this.cfg.get('POLL_MS') ?? 3000);
    this.loopNumbers = Number(this.cfg.get('LOOP_NUMBERS') ?? 1);

    this.slippageBps = Number(this.cfg.get('SLIPPAGE_BPS') ?? 50); // 0.50%
    this.deadlineSec = Number(this.cfg.get('DEADLINE_SEC') ?? 60);
    this.amountInWETH = this.cfg.get<string>('AMOUNT_IN_WETH') ?? '0.05';

    const rpc = this.cfg.get<string>('RPC_URL');
    if (!rpc) throw new Error('RPC_URL is required');
    this.provider = new ethers.JsonRpcProvider(rpc, {
      chainId: 42161,
      name: 'arbitrum',
    });

    const pk = this.cfg.get<string>('PRIVATE_KEY') || '';
    if (!pk) throw new Error('PRIVATE_KEY is required');

    this.signer = new ethers.Wallet(pk, this.provider);

    this.executorAddr =
      this.cfg.get<string>('DEPLOYED_CONTRACT_ADDRESS_MAINNET') || '';
    if (!this.executorAddr)
      throw new Error('DEPLOYED_CONTRACT_ADDRESS_MAINNET is required');
    this.logger.log(`Executor ready at ${this.executorAddr}`);

    this.executor = new ethers.Contract(
      this.executorAddr,
      EXECUTOR_ABI,
      this.signer,
    );

    void this.loop();
    void this.demo();
  }

  // bot: числовые приведения, minOut, вызов контракта
  private async bot() {
    const getWethUsdcQuotes = await this.dex.getWethUsdcQuotes(
      this.amountInWETH,
    );

    this.logger.log(getWethUsdcQuotes);

    const opportunity = this.opp.evaluateArbitrage(getWethUsdcQuotes);

    this.logger.log(opportunity);
  }

  private async getUniQuote() {
    const [
      uniSellWethForUsdcBest,
      uniBuyWethForUsdcBest,
    ] = await Promise.all([
      this.dex.uniSellWethForUsdcBest(this.amountInWETH),
      this.dex.uniBuyWethForUsdcBest(this.amountInWETH),
    ]);
    this.logger.log({
      uniSellWethForUsdcBest,
      uniBuyWethForUsdcBest,
    });

    await this.quotesService.saveUniSnapshot({
      chainId: 42161,
      amountInWeth: this.amountInWETH,
      uniSell: uniSellWethForUsdcBest,
      uniBuy: uniBuyWethForUsdcBest,
    });
  }

  async demo() {
    const uni = this.dexFactory.create({
      dex: 'UniswapV3',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      quoterAddr: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      factoryAddr: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    });

    const sushi = this.dexFactory.create({
      dex: 'SushiV2',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      routerAddr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    });

    const base = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'; // WETH
    const quote = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
    const baseDecimals = 18;
    const quoteDecimals = 6;

    const buyOnUni = await uni.getBuyQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    const sellOnUni = await uni.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    const buyOnSushi = await sushi.getBuyQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    const sellOnSushi = await sushi.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    console.log({ buyOnUni, sellOnUni, buyOnSushi, sellOnSushi });
  }

  private async loop() {
    for (let i = 0; i < this.loopNumbers; i++) {
      try {
        // await this.bot();
        await this.getUniQuote();
      } catch (e) {
        this.logger.error('loop error', e);
      }
      await new Promise((r) => setTimeout(r, this.pollMs));
    }
  }

}
