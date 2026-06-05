export function normalizeRpcUrlForStore(rpcUrl: any) {
  return {
    rpcUrlId: Number(rpcUrl.rpcUrlId ?? rpcUrl.id),
    rpcUrl: rpcUrl.rpcUrl ?? rpcUrl.url ?? '',
    chainId: rpcUrl.chainId ?? rpcUrl.chain?.chainId ?? null,
  };
}
