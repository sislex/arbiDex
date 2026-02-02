export class PoolDto {
  poolId?: number;
  chainId: number;
  token: number;
  token2: number;
  dexId: number;
  version: 'v2' | 'v3' | 'v4';
  fee: number;
  poolAddress: string;
  reserve0?: string;
  reserve1?: string;
}

export class UpdatePoolDto {
  poolId: number;
  chainId: number;
  token: number;
  token2: number;
  dexId: number;
  version: 'v2' | 'v3' | 'v4';
  fee: number;
  poolAddress: string;
  reserve0?: string;
  reserve1?: string;
}

export class UpdateReservesDto {
  address: string;
  token: string;
  token2: string;
  reserve0: string;
  reserve1: string;
}

export class CreatePoolDto {
  chainId: number;
  token: number;
  token2: number;
  dexId: number;
  fee: number;
  version: 'v2' | 'v3';
  poolAddress: string;
}
