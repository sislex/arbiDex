export function normalizeDexTokenForStore(token: any) {
  return {
    tokenId: Number(token.tokenId ?? token.id),
    address: token.address ?? '',
    symbol: token.symbol ?? '',
    tokenName: token.tokenName ?? '',
    decimals: token.decimals ?? null,
    chainId: token.chainId ?? token.chain?.chainId ?? null,
    isActive: token.isActive ?? null,
    isChecked: token.isChecked ?? null,
    balance: token.balance ?? null,
  };
}
