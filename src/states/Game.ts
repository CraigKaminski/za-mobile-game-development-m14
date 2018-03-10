import { Board } from '../prefabs/Board';
import { IUnitData, Unit } from '../prefabs/Unit';

interface IMapData {
  grid: number[][];
  playerBase: any;
  enemyBase: any;
}

export class Game extends Phaser.State {
  public board: Board;
  public enemyUnits: Phaser.Group;
  public playerUnits: Phaser.Group;
  public uiBlocked = false;
  public readonly TILE_W = 56;
  public readonly TILE_H = 64;
  public readonly MARGIN_X = 30;
  public readonly MARGIN_Y = 5;
  private allUnits: Unit[];
  private currentUnitIndex: number;

  public create() {
    const map: IMapData = JSON.parse(this.cache.getText('map'));
    this.board = new Board(this, map.grid);

    this.playerUnits = this.add.group();
    this.enemyUnits = this.add.group();

    this.initUnits();

    this.newTurn();
  }

  public clearSelection() {
    this.board.setAll('alpha', 1);

    this.board.forEach((tile: Phaser.Sprite) => {
      tile.events.onInputDown.removeAll();
    }, this);
  }

  public prepareNextUnit() {
    if (this.currentUnitIndex < this.allUnits.length) {
      const unit = this.allUnits[this.currentUnitIndex];
      this.currentUnitIndex++;
      if (unit.alive) {
        unit.showMovementOptions();
      } else {
        this.prepareNextUnit();
      }
    } else {
      this.newTurn();
    }
  }

  private initUnits() {
    const playerUnitsData: IUnitData[] = JSON.parse(this.cache.getText('playerUnits'));

    playerUnitsData.forEach((unitData) => {
      const unit = new Unit(this, unitData);

      unit.data.isPlayer = true;

      this.playerUnits.add(unit);
    });

    const enemyUnitsData: IUnitData[] = JSON.parse(this.cache.getText('enemyUnits'));

    enemyUnitsData.forEach((unitData) => {
      const unit = new Unit(this, unitData);

      unit.data.isPlayer = false;

      this.enemyUnits.add(unit);
    });
  }

  private newTurn() {
    this.allUnits = [];

    this.playerUnits.forEachAlive((unit: Unit) => {
      this.allUnits.push(unit);
    }, this);

    this.enemyUnits.forEachAlive((unit: Unit) => {
      this.allUnits.push(unit);
    }, this);

    this.shuffle(this.allUnits);

    this.currentUnitIndex = 0;

    this.prepareNextUnit();
  }

  private shuffle(array: any[]) {
    let counter = array.length;
    let temp: any;
    let index: number;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  }
}
