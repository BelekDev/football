import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player.model';
import { Position, POSITION_NAMES } from '../../constants/positions.const';
import { PositionWithPlayer, DropEvent } from '../../models/formation.model';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormationComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly players$: Observable<Player[]>;
  readonly fieldPositions$: Observable<Record<Position, Player | null>>;
  readonly positionNames = POSITION_NAMES;

  hoveredPosition: Position | null = null;
  hoveredPlayer: Player | null = null;

  constructor(private readonly playerService: PlayerService) {
    this.players$ = this.playerService.players$;
    this.fieldPositions$ = this.playerService.fieldPositions$;
  }

  ngOnInit(): void {
    this.setupDragAndDropHandlers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDragAndDropHandlers(): void {
    this.players$
      .pipe(takeUntil(this.destroy$))
      .subscribe(players => {
        // Здесь можно добавить дополнительную логику инициализации
      });
  }

  getPositions(positions: Record<Position, Player | null>): PositionWithPlayer[] {
    return Object.entries(positions).map(([key, value]) => ({
      key: key as Position,
      value
    }));
  }

  onDrop(event: CdkDragDrop<any>): void {
    const dropEvent = this.parseDropEvent(event);
    if (!dropEvent) {
      return;
    }

    if (this.playerService.canDrop(dropEvent.position, dropEvent.player)) {
      this.playerService.movePlayer(dropEvent.player, dropEvent.position);
    }
  }

  private parseDropEvent(event: CdkDragDrop<any>): DropEvent | null {
    if (event.previousContainer === event.container || 
        !event.item.data || 
        !event.container.id) {
      return null;
    }

    return {
      player: event.item.data as Player,
      position: event.container.id as Position
    };
  }

  removePlayer(position: Position): void {
    this.playerService.removePlayer(position);
  }

  saveFormation(): void {
    this.playerService.saveFormation();
  }

  canDropDrag(position: Position, drag: CdkDrag<Player>): boolean {
    const player = drag.data;
    return this.playerService.canDrop(position, player);
  }

  canDropHover(position: Position, player: Player): boolean {
    return this.playerService.canDrop(position, player);
  }

  trackByPlayerId(_: number, player: Player): number {
    return player.id;
  }

  trackByPosition(_: number, position: PositionWithPlayer): Position {
    return position.key;
  }

  onDragStarted(): void {
    document.body.style.cursor = 'grabbing';
  }

  onDragEnded(): void {
    document.body.style.cursor = '';
  }
} 