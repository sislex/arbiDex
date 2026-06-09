export function normalizeDexPoolForStore(pool: any) {
  return {
    poolId: Number(pool.poolId ?? pool.id),
    poolAddress: pool.poolAddress ?? pool.address ?? '',
    reserve0: pool.reserve0 ?? null,
    reserve1: pool.reserve1 ?? null,
    version: pool.version ?? pool.dexVersion ?? null,
    fee: pool.fee ?? null,
    chainId: pool.chainId ?? pool.chain?.chainId ?? null,
    dexId: pool.dexId ?? pool.dex?.dexId ?? null,
    token0Id: pool.token0Id ?? pool.token0?.tokenId ?? null,
    token1Id: pool.token1Id ?? pool.token1?.tokenId ?? null,
  };
}
