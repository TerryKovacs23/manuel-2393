import { describe, expect, it } from 'vitest';
import { buildBetSummary } from '../../src/modules/dashboard/utils/betSummary';

describe('buildBetSummary', () => {
  it('returns a balanced donut summary with percentages and totals', () => {
    const summary = buildBetSummary({ wins: 14, losses: 9 });

    expect(summary.total).toBe(23);
    expect(summary.wins).toBe(14);
    expect(summary.losses).toBe(9);
    expect(summary.winsPercentage).toBeCloseTo(60.87, 2);
    expect(summary.lossesPercentage).toBeCloseTo(39.13, 2);
    expect(summary.segments).toEqual([
      {
        label: 'Ganadas',
        value: 14,
        color: '#2d3436',
        percentage: 60.87,
      },
      {
        label: 'Perdidas',
        value: 9,
        color: '#dfe6e9',
        percentage: 39.13,
      },
    ]);
  });
});
