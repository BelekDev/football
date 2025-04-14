import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../models/player.model';
import { Position } from '../constants/positions.const';
import { FormationState } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly STORAGE_KEY = 'football_formation';
  private readonly stateSubject = new BehaviorSubject<FormationState>({
    players: [],
    fieldPositions: this.getInitialFieldPositions()
  });

  players$ = this.stateSubject.pipe(map(state => state.players));
  fieldPositions$ = this.stateSubject.pipe(map(state => state.fieldPositions));

  constructor() {
    this.loadInitialPlayers();
  }

  private getInitialFieldPositions(): Record<Position, Player | null> {
    return Object.values(Position).reduce((acc, position) => {
      acc[position] = null;
      return acc;
    }, {} as Record<Position, Player | null>);
  }

  private loadInitialPlayers(): void {
    const initialPlayers: Player[] = [
      {
        id: 1,
        number: 1,
        firstName: 'Игорь',
        lastName: 'Акинфеев',
        photoUrl: 'https://via.placeholder.com/40',
        allowedPositions: [Position.GK],
        description: 'Вратарь'
      },
      {
        id: 2,
        number: 4,
        firstName: 'Сергей',
        lastName: 'Игнашевич',
        photoUrl: 'https://via.placeholder.com/40',
        allowedPositions: [Position.CB1, Position.CB2],
        description: 'Центральный защитник'
      },
      {
        id: 3,
        number: 8,
        firstName: 'Денис',
        lastName: 'Глушаков',
        photoUrl: 'https://via.placeholder.com/40',
        allowedPositions: [Position.CM1, Position.CM2],
        description: 'Центральный полузащитник'
      },
      {
        id: 4,
        number: 10,
        firstName: 'Алан',
        lastName: 'Дзагоев',
        photoUrl: 'https://via.placeholder.com/40',
        allowedPositions: [Position.CM1, Position.CM2, Position.LM, Position.RM],
        description: 'Полузащитник'
      },
      {
        id: 5,
        number: 11,
        firstName: 'Александр',
        lastName: 'Кокорин',
        photoUrl: 'https://via.placeholder.com/40',
        allowedPositions: [Position.ST1, Position.ST2],
        description: 'Нападающий'
      }
    ];

    this.updateState({ players: initialPlayers });
  }

  private updateState(partialState: Partial<FormationState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...partialState });
  }

  movePlayer(player: Player, position: Position): void {
    const currentState = this.stateSubject.value;
    const { players, fieldPositions } = currentState;

    // Удаляем игрока с текущей позиции, если он уже на поле
    const updatedFieldPositions = { ...fieldPositions };
    Object.entries(updatedFieldPositions).forEach(([pos, p]) => {
      if (p?.id === player.id) {
        updatedFieldPositions[pos as Position] = null;
      }
    });

    // Если на новой позиции есть игрок, возвращаем его в список
    const existingPlayer = updatedFieldPositions[position];
    const updatedPlayers = existingPlayer 
      ? [...players.filter(p => p.id !== player.id), existingPlayer]
      : players.filter(p => p.id !== player.id);

    // Обновляем позицию
    updatedFieldPositions[position] = player;

    this.updateState({
      players: updatedPlayers,
      fieldPositions: updatedFieldPositions
    });
  }

  removePlayer(position: Position): void {
    const currentState = this.stateSubject.value;
    const { players, fieldPositions } = currentState;
    const player = fieldPositions[position];

    if (player) {
      const updatedFieldPositions = { ...fieldPositions, [position]: null };
      const updatedPlayers = [...players, player];

      this.updateState({
        players: updatedPlayers,
        fieldPositions: updatedFieldPositions
      });
    }
  }

  saveFormation(): void {
    const { fieldPositions } = this.stateSubject.value;
    const formation = Object.entries(fieldPositions)
      .filter(([_, player]) => player !== null)
      .map(([position, player]) => ({
        position,
        playerId: player!.id
      }));

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formation));
  }

  canDrop(position: Position, player: Player): boolean {
    return player.allowedPositions.includes(position);
  }
} 