export interface GameConfig {
  pointsToWin: number;
  foulsForPoint: number;
  exitsForWarning: number;
  maxTimeInSeconds: number;
}

export const gameConfig: GameConfig = {
  pointsToWin: 7,
  foulsForPoint: 2,
  exitsForWarning: 3,
  maxTimeInSeconds: 90, // 1 minuto y 30 segundos
};

