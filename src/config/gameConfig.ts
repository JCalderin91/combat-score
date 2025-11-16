export interface GameConfig {
  pointsToWin: number;
  foulsForPoint: number;
  exitsForWarning: number;
  maxTimeInSeconds: number;
}

// La configuración reactiva ahora se maneja en useConfig.ts
// Este archivo solo exporta el tipo para compatibilidad

