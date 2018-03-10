import { Board } from '../prefabs/Board';
import { IUnitData, Unit } from '../prefabs/Unit';

interface IMapData {
  grid: number[][];
  playerBase: any;
  enemyBase: any;
}

export class Game extends Phaser.State {
  public board: Board;
  public readonly TILE_W = 56;
  public readonly TILE_H = 64;
  public readonly MARGIN_X = 30;
  public readonly MARGIN_Y = 5;
  private enemyUnits: Phaser.Group;
  private playerUnits: Phaser.Group;

  public create() {
    const map: IMapData = JSON.parse(this.cache.getText('map'));
    this.board = new Board(this, map.grid);

    this.playerUnits = this.add.group();
    this.enemyUnits = this.add.group();

    this.initUnits();
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

      unit.data.isPlayer = true;

      this.enemyUnits.add(unit);
    });
  }
}
