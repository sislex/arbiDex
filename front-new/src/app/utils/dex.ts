export function normalizeDexForStore(dex: any) {
  return {
    dexId: Number(dex.dexId ?? dex.id),
    name: dex.name ?? dex.dexName ?? '',
  };
}
