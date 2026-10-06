export interface BetSummarySegment {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export interface BetSummary {
  wins: number;
  losses: number;
  total: number;
  winsPercentage: number;
  lossesPercentage: number;
  segments: BetSummarySegment[];
}

export function buildBetSummary({ wins, losses }: { wins: number; losses: number }): BetSummary {
  const total = wins + losses;

  const winsPercentage = total === 0 ? 0 : Number(((wins / total) * 100).toFixed(2));
  const lossesPercentage = total === 0 ? 0 : Number(((losses / total) * 100).toFixed(2));

  return {
    wins,
    losses,
    total,
    winsPercentage,
    lossesPercentage,
    segments: [
      {
        label: 'Ganadas',
        value: wins,
        color: '#2d3436',
        percentage: winsPercentage,
      },
      {
        label: 'Perdidas',
        value: losses,
        color: '#dfe6e9',
        percentage: lossesPercentage,
      },
    ],
  };
}
