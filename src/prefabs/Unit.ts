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
  }
}
