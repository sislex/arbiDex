export class PoolDto {
  poolId: number;
  chainId: number;
  token: number;
  token2: number;
  dexId: number;
  version: 'v2' | 'v3' | 'v4';
  fee: number;
  poolAddress: string;
}
