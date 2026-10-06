import { describe, expect, it } from 'vitest';
import { buildSnailRaceSummary } from '../../src/modules/dashboard/utils/snailRaceSummary';

describe('buildSnailRaceSummary', () => {
  it('returns six named racers with six simulated race results', () => {
    const summary = buildSnailRaceSummary();

    expect(summary).toHaveLength(6);
    expect(summary.map((snail) => snail.name)).toEqual([
      'Mochi',
      'Luna',
      'Nilo',
      'Brisa',
      'Rayo',
      'Turbo',
    ]);

    expect(summary.every((snail) => snail.races === 6)).toBe(true);
    expect(summary.reduce((total, snail) => total + snail.wins, 0)).toBe(6);
    expect(summary.every((snail) => snail.wins >= 0 && snail.wins <= 6)).toBe(true);
  });
});
