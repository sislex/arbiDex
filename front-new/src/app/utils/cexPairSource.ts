/** Maps CEX chain row id → display name (from GET /cex-chains). */
export function buildCexChainNameById(cexChains: any[] | undefined): Map<number, string> {
  const map = new Map<number, string>();
  (cexChains ?? []).forEach((chain: any) => {
    const id = chain.id ?? chain.chainId ?? chain.cexChainId;
    const name = chain.name ?? chain.chainName ?? '';
    if (id !== undefined && id !== null && name) {
      map.set(Number(id), String(name));
    }
  });
  return map;
}

/** Turns pair.source / sourceId (often numeric) into chain name when possible. */
export function resolveCexPairSourceLabel(pair: any, cexChainNameById: Map<number, string>): string {
  const rawSource =
    pair.source ??
    pair.sourceId ??
    pair.exchangeId ??
    pair.cexChainId ??
    pair.chainId ??
    '';

  let idCandidate = NaN;
  if (typeof rawSource === 'number' && Number.isFinite(rawSource)) {
    idCandidate = rawSource;
  } else if (typeof rawSource === 'string') {
    const s = rawSource.trim();
    if (s !== '' && /^\d+$/.test(s)) {
      idCandidate = Number(s);
    }
  }

  if (Number.isFinite(idCandidate) && cexChainNameById.has(idCandidate)) {
    return cexChainNameById.get(idCandidate)!;
  }

  const textFallback =
    pair.exchange ??
    pair.exchangeName ??
    pair.chainName ??
    pair.sourceName ??
    (typeof rawSource === 'string' && rawSource.trim() !== '' && !/^\d+$/.test(rawSource.trim())
      ? rawSource
      : '');

  return textFallback || String(rawSource ?? '');
}

/** Prefer job-level fields when present (CEX jobs list joined with pair). */
export function resolveCexSourceFromJobAndPair(
  job: any,
  pair: any | undefined,
  cexChainNameById: Map<number, string>,
): string {
  const merged = {
    ...(pair ?? {}),
    source: job?.source ?? pair?.source,
    sourceId: job?.sourceId ?? pair?.sourceId,
    exchangeId: job?.exchangeId ?? pair?.exchangeId,
    cexChainId: job?.cexChainId ?? pair?.cexChainId,
    chainId: job?.chainId ?? pair?.chainId,
    exchange: job?.exchange ?? pair?.exchange,
    exchangeName: job?.exchangeName ?? pair?.exchangeName,
    chainName: job?.chainName ?? pair?.chainName,
    sourceName: job?.sourceName ?? pair?.sourceName,
  };
  return resolveCexPairSourceLabel(merged, cexChainNameById);
}
