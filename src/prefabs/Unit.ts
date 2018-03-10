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

    /*
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.showMovementOptions, this);
    */
  }

  public showMovementOptions() {
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

  private attack(attacked: Unit) {
    const attacker = this;

    const damageAttacked = Math.max(0,
      attacker.data.attack * Math.random() - attacked.data.defense * Math.random());
    const damageAttacker = Math.max(0,
      attacked.data.attack * Math.random() - attacker.data.defense * Math.random());

    attacked.data.health -= damageAttacked;
    attacker.data.health -= damageAttacker;

    if (attacked.data.health <= 0) {
      attacked.kill();
    }

    if (attacker.data.health <= 0) {
      attacker.kill();
    }
  }

  private checkBattle() {
    const rivalUnits = this.data.isPlayer ? this.state.enemyUnits : this.state.playerUnits;
    let fightUnit: Unit | undefined;

    rivalUnits.forEachAlive((unit: Unit) => {
      if (this.data.row === unit.data.row && this.data.col === unit.data.col) {
        fightUnit = unit;
      }
    }, this);

    if (fightUnit) {
      while (this.data.health >= 0 && fightUnit.data.health >= 0) {
        this.attack(fightUnit);
      }
    }
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

      this.checkBattle();

      this.state.prepareNextUnit();
    }, this);
    unitMovement.start();

  }
}
