import { Injectable } from '@angular/core';

export interface ExchangeRates {
  [tokenId: number]: { [targetId: number]: number };
}

@Injectable({ providedIn: 'root' })
export class CurrencyConverterService {

  convert(amount: number, from: number, to: number, rates: ExchangeRates): number | null {
    if (from === to) return amount;

    const path = this.findPath(from, to, rates);
    if (!path) return null;

    return path.reduce((acc, rate) => acc * rate, amount);
  }

  private findPath(start: number, end: number, rates: ExchangeRates): number[] | null {
    const queue: { curr: number; path: number[] }[] = [{ curr: start, path: [] }];
    const visited = new Set<number>([start]);

    while (queue.length > 0) {
      const { curr, path } = queue.shift()!;

      if (curr === end) return path;

      const neighbors = rates[curr];
      if (!neighbors) continue;

      for (const [neighborIdStr, rate] of Object.entries(neighbors)) {
        const neighborId = Number(neighborIdStr);
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ curr: neighborId, path: [...path, rate] });
        }
      }
    }
    return null;
  }
}
