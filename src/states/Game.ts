import { Board } from '../prefabs/Board';

interface IMapData {
  grid: number[][];
  playerBase: any;
  enemyBase: any;
}

export class Game extends Phaser.State {
  public readonly TILE_W = 56;
  public readonly TILE_H = 64;
  public readonly MARGIN_X = 30;
  public readonly MARGIN_Y = 5;

  public create() {
    const map: IMapData = JSON.parse(this.cache.getText('map'));
    const board = new Board(this, map.grid);
  }
}
