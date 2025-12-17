export class PoolDto {
  chainId: number;
  baseTokenId: number;
  quoteTokenId: number;
  dexId: number;
  version: 'v2' | 'v3' | 'v4';
  fee: number;
  poolAddress: string;
}
