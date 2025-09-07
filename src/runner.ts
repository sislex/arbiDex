import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpportunityService } from './services/opportunity/opportunity.service';

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);
  private readonly pollMs: number;

  constructor(
    private cfg: ConfigService,
    private opp: OpportunityService,
  ) {
    this.pollMs = Number(this.cfg.get('POLL_MS') ?? 3000);
    void this.loop();
  }
  private logSuccessResult(res) {
    this.logger.log(`WETH->USDC |--------------------------------`);
    this.logger.log(`(for ${res.amountInWeth} WETH)`);
    this.logger.log(
      `Uni:  out=${res.uniOutUSDC}, fee=${res.uniFee}, feeUSDC=${res.uniFeeUSDC}`,
    );
    this.logger.log(
      `Sushi:  out=${res.sushiOutUSDC}, fee=${res.sushiFee}, feeUSDC=${res.sushiFeeUSDC}`,
    );
    this.logger.log(`direction=${res.direction} | better=${res.better}`);
    this.logger.log(`gasUSD=${res.gasUSD}`);
    this.logger.log(
      `netUSD=${res.netUSD} | netPct=${res.netPct}| grossPct=${res.grossPct}`,
    );
  }
  private logErrorResult(res) {
    this.logger.error(`WETH->USDC |--------------------------------`);
    this.logger.error(`(for ${res.amountInWeth} WETH)`);
    this.logger.error(`No arbitrage opportunity: netUSD=${res.netUSD}`);
    this.logger.error(
      `Uni:  out=${res.uniOutUSDC}, fee=${res.uniFee}, feeUSDC=${res.uniFeeUSDC}`,
    );
    this.logger.error(
      `Sushi:  out=${res.sushiOutUSDC}, fee=${res.sushiFee}, feeUSDC=${res.sushiFeeUSDC}`,
    );
    this.logger.error(`direction=${res.direction} | better=${res.better}`);
    this.logger.error(`gasUSD=${res.gasUSD}`);
    this.logger.error(
      `netUSD=${res.netUSD} | netPct=${res.netPct}| grossPct=${res.grossPct}`,
    );
  }

  private async loop() {
    while (true) {
      try {
        this.bot();
      } catch (e) {
        this.logger.error('loop error', e);
      }
      await new Promise((r) => setTimeout(r, this.pollMs));
    }
  }

  private async bot() {
    const opportunity = await this.opp.findOpportunity();
    const netUSD = opportunity.netUSD;
    if (netUSD > this.cfg.get('MIN_ABS_PROFIT_USD')) {
      this.logger.warn(`!!! ARBITRAGE OPPORTUNITY DETECTED !!!`);
      this.logSuccessResult(opportunity);
      // здесь можно вставить вызов смарт-контракта для арбитража
    } else {
      this.logErrorResult(opportunity);
      // this.logger.error(`No arbitrage opportunity: netUSD=${netUSD}`);
    }
  }
}
