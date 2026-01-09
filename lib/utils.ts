export function shuffle<T>(array: T[], seed?: number): T[] {
  const t = [...array];
  let m = t.length;
  let i = 0;

  // Simple LCG or Sin-based PRNG for deterministic shuffle if seed provided
  const random = seed !== undefined 
    ? () => {
        // Simple seeded random
        const x = Math.sin(seed + i++) * 10000;
        return x - Math.floor(x);
      }
    : Math.random;

  while (m) {
    const i = Math.floor(random() * m--);
    [t[m], t[i]] = [t[i], t[m]];
  }

  return t;
}
