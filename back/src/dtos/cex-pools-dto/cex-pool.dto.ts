import { CexChainDto } from '../cex-chains-dto/cex-chain.dto';

export class CexPoolDto {
  id?: number;
  source: number;
  token0: string;
  token1: string;

  chain?: CexChainDto;
}
