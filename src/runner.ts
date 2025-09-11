import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpportunityService } from './services/opportunity/opportunity.service';
import { Contract, ethers } from 'ethers';
import { DexProviderService } from './services/dex-provider/dex-provider.service';

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

  private async loop() {
    for (let i = 0; i < this.loopNumbers; i++) {
      try {
        await this.bot();
      } catch (e) {
        this.logger.error('loop error', e);
      }
      await new Promise((r) => setTimeout(r, this.pollMs));
    }
  }

  private logSuccessResult(opportunity) {
    this.logger.log(`WETH->USDC |--------------------------------`);
    this.logger.log(opportunity);
  }

  private logErrorResult(opportunity) {
    this.logger.error(`WETH->USDC |--------------------------------`);
    this.logger.error(opportunity);
  }
}
