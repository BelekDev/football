import { Position } from '../constants/positions.const';

export interface Player {
  id: number;
  number: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
  position?: Position;
  allowedPositions: Position[];
  description: string;
} 