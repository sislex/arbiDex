export interface JobPair {
  dex: string;
  version: string;
  poolAddress: string;
}

export const mapPoolToJobPair = (pool: {
  dex?: { name?: string };
  dexName?: string;
  version?: string | null;
  poolAddress?: string | null;
}): JobPair => ({
  dex: String(pool.dex?.name ?? pool.dexName ?? '')
    .trim()
    .toLowerCase(),
  version: String(pool.version ?? '').trim(),
  poolAddress: String(pool.poolAddress ?? '').trim(),
});

export const mapPoolJobRelationToJobPair = (relation: any): JobPair => {
  const pool = relation?.pool ?? {};
  return mapPoolToJobPair(pool);
};
