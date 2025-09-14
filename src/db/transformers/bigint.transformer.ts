export const bigIntTransformer = {
  to: (v?: bigint | null) =>
    typeof v === 'bigint' ? v.toString() : (v ?? null),
  from: (v?: string | null) => (v != null ? BigInt(v) : null),
};
