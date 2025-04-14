import { Player } from './player.model';
import { Position } from '../constants/positions.const';

export interface FormationState {
  players: Player[];
  fieldPositions: Record<Position, Player | null>;
}

export interface PositionWithPlayer {
  key: Position;
  value: Player | null;
}

export interface DropEvent {
  player: Player;
  position: Position;
} 