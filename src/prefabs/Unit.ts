import { Game } from '../states/Game';
import { Board } from './Board';

export interface IUnitData {
  asset: string;
  attack: number;
  col: number;
  defense: number;
  health: number;
  isPlayer?: boolean;
  row: number;
}

export class Unit extends Phaser.Sprite {
  public data: IUnitData;
  private board: Board;
  private state: Game;

  constructor(state: Game, data: IUnitData) {
    const position = state.board.getXYFromRowCol(data.row, data.col);
    super(state.game, position.x, position.y, data.asset);

    this.state = state;
    this.board = state.board;
    this.data = data;

    this.anchor.setTo(0.5);

    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.showMovementOptions, this);
  }

  private moveUnit(tile: Phaser.Sprite) {
    this.state.clearSelection();
    this.state.uiBlocked = true;
    const pos = this.board.getXYFromRowCol(tile.data.row, tile.data.col);
    const unitMovement = this.game.add.tween(this);
    unitMovement.to(pos, 200);
    unitMovement.onComplete.add(() => {
      this.state.uiBlocked = false;
      this.data.row = tile.data.row;
      this.data.col = tile.data.col;
    }, this);
    unitMovement.start();
  }

  private showMovementOptions() {
    this.state.clearSelection();

    if (this.state.uiBlocked) {
      return;
    }

    const currentTile = this.board.getFromRowCol(this.data.row, this.data.col);
    const adjacentCells = this.board.getAdjacent(currentTile, true);

    adjacentCells.forEach((tile) => {
      tile.alpha = 0.7;
      tile.events.onInputDown.add(this.moveUnit, this);
    });
  }
}
