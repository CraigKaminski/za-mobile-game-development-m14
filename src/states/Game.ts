import { Board } from '../prefabs/Board';
import { IUnitData, Unit } from '../prefabs/Unit';

interface IMapData {
  grid: number[][];
  playerBase: IPlaceData;
  enemyBase: IPlaceData;
}

interface IPlaceData {
  asset: string;
  col: number;
  row: number;
}

export class Game extends Phaser.State {
  public board: Board;
  public enemyBase: Phaser.Sprite;
  public enemyUnits: Phaser.Group;
  public places: Phaser.Group;
  public playerBase: Phaser.Sprite;
  public playerUnits: Phaser.Group;
  public uiBlocked = false;
  public readonly TILE_W = 56;
  public readonly TILE_H = 64;
  public readonly MARGIN_X = 30;
  public readonly MARGIN_Y = 5;
  private allUnits: Unit[];
  private currentUnitIndex: number;
  private map: IMapData;

  public create() {
    this.map = JSON.parse(this.cache.getText('map'));
    this.board = new Board(this, this.map.grid);
    this.places = this.add.group();

    this.playerUnits = this.add.group();
    this.enemyUnits = this.add.group();

    this.initUnits();
    this.initPlaces();

    this.newTurn();
  }

  public checkGameEnd() {
    const unit = this.allUnits[this.currentUnitIndex - 1];

    if (unit.data.isPlayer) {
      if (unit.data.row === this.enemyBase.data.row && unit.data.col === this.enemyBase.data.col) {
        console.log('you won!');
      }
    } else {
      if (unit.data.row === this.playerBase.data.row && unit.data.col === this.playerBase.data.col) {
        console.log('you lost!');
      }
    }
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
        unit.playTurn();
      } else {
        this.prepareNextUnit();
      }
    } else {
      this.newTurn();
    }
  }

  private initPlaces() {
    let pos = this.board.getXYFromRowCol(this.map.playerBase.row, this.map.playerBase.col);
    this.playerBase = new Phaser.Sprite(this.game, pos.x, pos.y, this.map.playerBase.asset);
    this.playerBase.anchor.setTo(0.5);
    this.playerBase.data.row = this.map.playerBase.row;
    this.playerBase.data.col = this.map.playerBase.col;
    this.places.add(this.playerBase);

    pos = this.board.getXYFromRowCol(this.map.enemyBase.row, this.map.enemyBase.col);
    this.enemyBase = new Phaser.Sprite(this.game, pos.x, pos.y, this.map.enemyBase.asset);
    this.enemyBase.anchor.setTo(0.5);
    this.enemyBase.data.row = this.map.enemyBase.row;
    this.enemyBase.data.col = this.map.enemyBase.col;
    this.places.add(this.enemyBase);
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
