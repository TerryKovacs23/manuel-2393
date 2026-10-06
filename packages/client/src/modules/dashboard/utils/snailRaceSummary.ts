export interface SnailRaceResult {
  name: string;
  color: string;
  wins: number;
  races: number;
}

export function buildSnailRaceSummary(): SnailRaceResult[] {
  const racers: SnailRaceResult[] = [
    { name: 'Mochi', color: '#2d3436', wins: 3, races: 6 },
    { name: 'Luna', color: '#4a5357', wins: 1, races: 6 },
    { name: 'Nilo', color: '#6c757d', wins: 0, races: 6 },
    { name: 'Brisa', color: '#9aa6aa', wins: 2, races: 6 },
    { name: 'Rayo', color: '#c7d3d8', wins: 0, races: 6 },
    { name: 'Turbo', color: '#dfe6e9', wins: 0, races: 6 },
  ];

  return racers;
}
